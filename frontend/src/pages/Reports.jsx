import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { FileBarChart, Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import { formatCurrency, formatDate } from "../lib/format";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [dailyData, setDailyData] = useState({ transactions: [], payments: [], totals: {} });
  const [monthlyData, setMonthlyData] = useState({ transactions: [], payments: [], totals: {}, chart: [] });

  useEffect(() => {
    if (tab === "daily") loadDaily();
    else loadMonthly();
  }, [tab, selectedDate, selectedMonth]);

 async function loadDaily() {
  setLoading(true);

  try {
    const [txRes, payRes] = await Promise.all([
      api.get("/transactions"),
      api.get("/payments"),
    ]);

   const txData = (txRes.data || []).filter((t) => {
  const txDate = new Date(t.date).toLocaleDateString("en-CA");
  return txDate === selectedDate;
});

    const payData = (payRes.data || []).filter((p) => {
  const payDate = new Date(p.payment_date || p.date).toLocaleDateString("en-CA");
  return payDate === selectedDate;
});

    const revenue = txData
      .filter((t) => t.type === "SELL")
      .reduce((sum, t) => sum + Number(t.total_amount || 0), 0);

    const expenses = txData
      .filter((t) => t.type === "BUY")
      .reduce((sum, t) => sum + Number(t.total_amount || 0), 0);

    const paid = payData
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const pending = payData
      .filter((p) => p.status === "PENDING")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    setDailyData({
      transactions: txData,
      payments: payData,
      totals: {
        revenue,
        expenses,
        profit: revenue - expenses,
        paid,
        pending,
        count: txData.length,
      },
    });

  } catch (err) {
    console.error(err);
    toast.error("Failed to load report");
  } finally {
    setLoading(false);
  }
}

async function loadMonthly() {
  setLoading(true);

  try {
    const daysInMonth = new Date(
      Number(selectedMonth.split("-")[0]),
      Number(selectedMonth.split("-")[1]),
      0
    ).getDate();

    const [txRes, payRes] = await Promise.all([
      api.get("/transactions"),
      api.get("/payments"),
    ]);

    const txData = (txRes.data || []).filter(
      (t) => t.date?.slice(0, 7) === selectedMonth
    );

    const payData = (payRes.data || []).filter(
      (p) => (p.payment_date || p.date)?.slice(0, 7) === selectedMonth
    );

    const revenue = txData
      .filter((t) => t.type === "SELL")
      .reduce((s, t) => s + Number(t.total_amount || 0), 0);

    const expenses = txData
      .filter((t) => t.type === "BUY")
      .reduce((s, t) => s + Number(t.total_amount || 0), 0);

    const paid = payData
      .filter((p) => p.status === "PAID")
      .reduce((s, p) => s + Number(p.amount || 0), 0);

    const pending = payData
      .filter((p) => p.status === "PENDING")
      .reduce((s, p) => s + Number(p.amount || 0), 0);

    const chart = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${selectedMonth}-${String(d).padStart(2, "0")}`;

      const dayTx = txData.filter(
        (t) => t.date?.slice(0, 10) === dateStr
      );

      chart.push({
        day: String(d),
        revenue: dayTx
          .filter((t) => t.type === "SELL")
          .reduce((s, t) => s + Number(t.total_amount || 0), 0),
        expenses: dayTx
          .filter((t) => t.type === "BUY")
          .reduce((s, t) => s + Number(t.total_amount || 0), 0),
      });
    }

    setMonthlyData({
      transactions: txData,
      payments: payData,
      totals: {
        revenue,
        expenses,
        profit: revenue - expenses,
        paid,
        pending,
        count: txData.length,
      },
      chart,
    });

  } catch (err) {
    console.error(err);
    toast.error("Failed to load monthly report");
  } finally {
    setLoading(false);
  }
}


  const data = tab === "daily" ? dailyData : monthlyData;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Review your daily and monthly business performance." />

      {/* Tabs */}
      <div className="mb-6 inline-flex rounded-lg border border-ink-200 bg-white p-1">
        <button
          onClick={() => setTab("daily")}
          className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
            tab === "daily" ? "bg-primary-500 text-white" : "text-ink-600 hover:bg-ink-50"
          }`}
        >
          <Calendar className="h-4 w-4" /> Daily
        </button>
        <button
          onClick={() => setTab("monthly")}
          className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
            tab === "monthly" ? "bg-primary-500 text-white" : "text-ink-600 hover:bg-ink-50"
          }`}
        >
          <FileBarChart className="h-4 w-4" /> Monthly
        </button>
      </div>

      {/* Date picker */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        {tab === "daily" ? (
          <div>
            <label className="label" htmlFor="date">Select date</label>
            <input id="date" type="date" className="input" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </div>
        ) : (
          <div>
            <label className="label" htmlFor="month">Select month</label>
            <input id="month" type="month" className="input" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
          </div>
        )}
      </div>

      {loading ? (
        <Spinner label="Generating report..." />
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard icon={TrendingUp} label="Revenue (SELL)" value={formatCurrency(data.totals.revenue || 0)} accent="green" />
            <SummaryCard icon={TrendingDown} label="Expenses (BUY)" value={formatCurrency(data.totals.expenses || 0)} accent="blue" />
            <SummaryCard icon={DollarSign} label="Net Profit" value={formatCurrency(data.totals.profit || 0)} accent={data.totals.profit >= 0 ? "green" : "red"} />
            <SummaryCard icon={Calendar} label="Transactions" value={data.totals.count || 0} accent="amber" />
          </div>

          {/* Monthly chart */}
          {tab === "monthly" && (
            <div className="mt-6 card p-5">
              <h3 className="mb-4 text-base font-semibold text-ink-800">Daily breakdown</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.chart} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#22C55E" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Transactions table */}
          <div className="mt-6 card p-5">
            <h3 className="mb-4 text-base font-semibold text-ink-800">
              {tab === "daily" ? "Transactions on " + formatDate(selectedDate) : "Transactions in " + selectedMonth}
            </h3>
            {data.transactions.length === 0 ? (
              <EmptyState icon={FileBarChart} title="No transactions" message="There are no transactions for this period." />
            ) : (
              <div className="table-wrap border-0 shadow-none">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Product</th>
                      <th>Party</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <span className={`badge ${t.type === "BUY" ? "bg-blue-50 text-blue-600" : "bg-primary-50 text-primary-600"}`}>{t.type}</span>
                        </td>
                        <td>{t.product_name || "—"}</td>
                        <td>{t.type === "BUY" ? t.farmer_name || "—" : t.buyer_name || "—"}</td>
                        <td className="font-medium">{formatCurrency(t.total_amount)}</td>
                        <td>
                          <span className={`badge ${t.status === "COMPLETED" ? "bg-primary-50 text-primary-600" : t.status === "PENDING" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>
                            {t.status}
                          </span>
                        </td>
                        <td>{formatDate(t.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payments summary */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="text-sm text-ink-500">Total Paid</p>
              <p className="mt-1 text-xl font-bold text-primary-600">{formatCurrency(data.totals.paid || 0)}</p>
            </div>
            <div className="card p-5">
              <p className="text-sm text-ink-500">Total Pending</p>
              <p className="mt-1 text-xl font-bold text-amber-600">{formatCurrency(data.totals.pending || 0)}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, accent }) {
  const colors = {
    green: "bg-primary-50 text-primary-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[accent]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-ink-500">{label}</p>
        <p className="text-xl font-bold text-ink-800">{value}</p>
      </div>
    </div>
  );
}
