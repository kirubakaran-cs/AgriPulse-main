import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  Users,
  Package,
  ArrowLeftRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import { formatCurrency, formatDate } from "../lib/format";

const PIE_COLORS = [
  "#22C55E",
  "#3B82F6",
  "#F59E0B",
  "#EC4899",
  "#EF4444",
];

export default function Dashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    farmers: 0,
    buyers: 0,
    products: 0,
    transactions: 0,
    revenue: 0,
  });

  const [recent, setRecent] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [byType, setByType] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const res = await api.get("/dashboard");

      const data = res.data;

      setStats({
        farmers: data.totalFarmers || 0,
        buyers: data.totalBuyers || 0,
        products: data.totalProducts || 0,
        transactions: data.totalTransactions || 0,
        revenue: Number(data.totalRevenue || 0),
      });

      setMonthly(data.monthlyRevenue || []);

      setByType(
        (data.transactionTypes || []).map((item) => ({
          name: item.type,
          value: Number(item.count),
        }))
      );

      setRecent(data.recentTransactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Spinner label="Loading dashboard..." />;
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="A quick overview of your agricultural brokerage business."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          index={0}
          icon={Sprout}
          label="Total Farmers"
          value={stats.farmers}
          accent="green"
        />

        <StatCard
          index={1}
          icon={Users}
          label="Total Buyers"
          value={stats.buyers}
          accent="blue"
        />

        <StatCard
          index={2}
          icon={Package}
          label="Total Products"
          value={stats.products}
          accent="amber"
        />

        <StatCard
          index={3}
          icon={ArrowLeftRight}
          label="Total Transactions"
          value={stats.transactions}
          accent="purple"
        />

        <StatCard
          index={4}
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(stats.revenue)}
          accent="green"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 text-base font-semibold">
            Revenue (Monthly)
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient
                    id="revGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#22C55E"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#22C55E"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22C55E"
                  fill="url(#revGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-base font-semibold">
            Transactions by Type
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byType}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {byType.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={
                        PIE_COLORS[index % PIE_COLORS.length]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">
            Recent Transactions
          </h3>

          <Link
            to="/transactions"
            className="text-primary-600"
          >
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions found"
            message="Transactions will appear here."
            actionLabel="View Transactions"
            actionTo="/transactions"
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recent.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.type === "BUY" ? (
                        <span className="flex items-center gap-1">
                          <TrendingDown className="h-4 w-4" />
                          BUY
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          SELL
                        </span>
                      )}
                    </td>

                    <td>
                      {formatCurrency(item.total_amount)}
                    </td>

                    <td>{item.status}</td>

                    <td>{formatDate(item.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}