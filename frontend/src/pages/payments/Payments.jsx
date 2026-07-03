import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, Wallet, CheckCircle, Clock } from "lucide-react";
import API from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";
import { formatCurrency, formatDate } from "../../lib/format";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
  try {
    setLoading(true);

    const res = await API.get("/payments");

    if (Array.isArray(res.data)) {
      setPayments(res.data);
    } else {
      setPayments([]);
    }
  } catch (err) {
    console.error(err);
    toast.error("Could not load payments.");
  } finally {
    setLoading(false);
  }
}

  const filtered = (payments || []).filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
  (p.method || "").toLowerCase().includes(q) ||
  (p.note || "").toLowerCase().includes(q) ||
  (p.transaction?.product?.name || "").toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const pendingTotal = payments
    .filter((p) => p.status === "PENDING")
    .reduce((s, p) => s + Number(p.amount || 0), 0);
  const paidTotal = payments
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + Number(p.amount || 0), 0);

 async function handleDelete() {
  if (!toDelete) return;

  try {
    setDeleting(true);

    await API.delete(`/payments/${toDelete.id}`);

    toast.success("Payment deleted.");

    setPayments((prev) =>
      prev.filter((p) => p.id !== toDelete.id)
    );

    setToDelete(null);
  } catch (err) {
    console.error(err);
    toast.error("Could not delete payment.");
  } finally {
    setDeleting(false);
  }
}

  async function toggleStatus(p) {
  const newStatus = p.status === "PAID" ? "PENDING" : "PAID";

  try {
    await API.put(`/payments/${p.id}`, {
      status: newStatus,
    });

    toast.success(
      newStatus === "PAID"
        ? "Marked as paid."
        : "Marked as pending."
    );

    setPayments((prev) =>
      prev.map((x) =>
        x.id === p.id
          ? { ...x, status: newStatus }
          : x
      )
    );
  } catch (err) {
    console.error(err);
    toast.error("Could not update payment status.");
  }
}
  return (
    <div>
      <PageHeader title="Payments" subtitle="Record and track payments for your transactions.">
        <Link to="/payments/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Record Payment
        </Link>
      </PageHeader>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-ink-500">Total Paid</p>
            <p className="text-xl font-bold text-ink-800">{formatCurrency(paidTotal)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-ink-500">Total Pending</p>
            <p className="text-xl font-bold text-ink-800">{formatCurrency(pendingTotal)}</p>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-9"
            placeholder="Search by method, product, note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "PENDING", "PAID"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                statusFilter === s
                  ? "bg-primary-500 text-white"
                  : "bg-white text-ink-600 border border-ink-200 hover:bg-ink-50"
              }`}
            >
              {s === "all" ? "All" : s === "PAID" ? "Paid" : "Pending"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading payments..." />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Wallet}
            title="No payments found"
            message="Record a payment against a transaction to track it here."
            actionLabel="Record Payment"
            actionTo="/payments/new"
          />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Note</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-ink-800">
                    {p.transaction?.product?.name || "—"}
                  </td>
                  <td className="font-semibold">{formatCurrency(Number(p.amount || 0))}</td>
                  <td>
                    <span className="badge bg-ink-100 text-ink-600">{(p.method || "N/A").replace("_", " ")}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(p)}
                      className={`badge cursor-pointer transition hover:opacity-80 ${
                        p.status === "PAID"
                          ? "bg-primary-50 text-primary-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                      title="Click to toggle status"
                    >
                      {p.status || "PENDING"}
                    </button>
                  </td>
                  <td>{p.date ? formatDate(p.date) : "—"}</td>
                  <td className="max-w-[200px] truncate">{p.note || "—"}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/payments/${p.id}/edit`} className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 hover:text-primary-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => setToDelete(p)} className="rounded-md p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete payment?"
        message="This will permanently remove the payment record. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
