import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, ArrowLeftRight, TrendingUp, TrendingDown } from "lucide-react";
import API from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";
import { formatCurrency, formatDate } from "../../lib/format";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    setLoading(true);
    const res = await API.get("/transactions");

setTransactions(res.data);
    setLoading(false);
    if (error) {
      toast.error("Could not load transactions.");
      return;
    }
    setTransactions(data || []);
  }

  const filtered = transactions.filter((t) => {
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      t.product?.name?.toLowerCase().includes(q) ||
      t.farmer?.name?.toLowerCase().includes(q) ||
      t.buyer?.name?.toLowerCase().includes(q) ||
      t.status?.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const { error } = await API.delete(`/transactions/${toDelete.id}`);
    setDeleting(false);
    if (error) {
      toast.error("Could not delete transaction.");
      return;
    }
    toast.success("Transaction deleted.");
    setTransactions((prev) => prev.filter((t) => t.id !== toDelete.id));
    setToDelete(null);
  }

  return (
    <div>
      <PageHeader title="Transactions" subtitle="Record and review your buy and sell transactions.">
        <Link to="/transactions/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New Transaction
        </Link>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-9"
            placeholder="Search by product, party, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "BUY", "SELL"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                typeFilter === t
                  ? "bg-primary-500 text-white"
                  : "bg-white text-ink-600 border border-ink-200 hover:bg-ink-50"
              }`}
            >
              {t === "all" ? "All" : t === "BUY" ? "Buy" : "Sell"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading transactions..." />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions found"
            message="Record your first buy or sell transaction to get started."
            actionLabel="New Transaction"
            actionTo="/transactions/new"
          />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Product</th>
                <th>Party</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const party = t.type === "BUY" ? t.farmer?.name : t.buyer?.name;
                return (
                  <tr key={t.id}>
                    <td>
                      <span className={`badge ${t.type === "BUY" ? "bg-blue-50 text-blue-600" : "bg-primary-50 text-primary-600"}`}>
                        {t.type === "BUY" ? (
                          <span className="flex items-center gap-1"><TrendingDown className="h-3 w-3" /> Buy</span>
                        ) : (
                          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Sell</span>
                        )}
                      </span>
                    </td>
                    <td className="font-medium text-ink-800">{t.product?.name || "—"}</td>
                    <td>{party || "—"}</td>
                    <td>{t.quantity}</td>
                    <td>{formatCurrency(t.unit_price)}</td>
                    <td className="font-semibold">{formatCurrency(t.total_amount)}</td>
                    <td>
                      <span className={`badge ${t.status === "COMPLETED" ? "bg-primary-50 text-primary-600" : t.status === "PENDING" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>{formatDate(t.date)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/transactions/${t.id}/edit`} className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 hover:text-primary-600" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button onClick={() => setToDelete(t)} className="rounded-md p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete transaction?"
        message="This will permanently remove the transaction. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
