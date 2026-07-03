import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";
import API from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";
import { formatDate } from "../../lib/format";

export default function Buyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadBuyers();
  }, []);

   async function loadBuyers() {
  try {
    setLoading(true);

    const res = await API.get("/buyers");

if (Array.isArray(res.data)) {
  setBuyers(res.data);
} else {
  setBuyers([]);
}
    
  } catch (err) {
    console.error(err);
    toast.error("Could not load buyers.");
  } finally {
    setLoading(false);
  }
}

  const filtered = (buyers || []).filter((b) => {
    const q = search.toLowerCase();
    return (
      b.name?.toLowerCase().includes(q) ||
      b.phone?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.company?.toLowerCase().includes(q)
    );
  });

   async function handleDelete() {
  if (!toDelete) return;

  try {
    setDeleting(true);

    await API.delete(`/buyers/${toDelete.id}`);

    toast.success("Buyer deleted.");

    setBuyers((prev) =>
      prev.filter((b) => b.id !== toDelete.id)
    );

    setToDelete(null);
  } catch (err) {
    console.error(err);
    toast.error("Could not delete buyer.");
  } finally {
    setDeleting(false);
  }
}
  return (
    <div>
      <PageHeader title="Buyers" subtitle="Manage the buyers you sell to.">
        <Link to="/buyers/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Buyer
        </Link>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-9"
            placeholder="Search by name, company, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-sm text-ink-500">{filtered.length} buyer(s)</p>
      </div>

      {loading ? (
        <Spinner label="Loading buyers..." />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Users}
            title="No buyers found"
            message="Add your first buyer to start tracking your customer network."
            actionLabel="Add Buyer"
            actionTo="/buyers/new"
          />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Address</th>
                <th>Added</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td className="font-medium text-ink-800">{b.name}</td>
                  <td>{b.company || "—"}</td>
                  <td>{b.phone || "—"}</td>
                  <td>{b.email || "—"}</td>
                  <td>{b.address || "—"}</td>
                  <td>{formatDate(b.created_at)}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/buyers/${b.id}/edit`} className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 hover:text-primary-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setToDelete(b)}
                        className="rounded-md p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
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
        title="Delete buyer?"
        message={`This will permanently remove "${toDelete?.name}". This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
