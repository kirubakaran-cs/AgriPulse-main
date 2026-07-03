import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, Eye, Sprout } from "lucide-react";
import API from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";
import { formatDate } from "../../lib/format";

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadFarmers();
  }, []);

  async function loadFarmers() {
  try {
    setLoading(true);

    const res = await API.get("/farmers");

    setFarmers(res.data);
  } catch (err) {
    console.error(err);
    toast.error("Could not load farmers.");
  } finally {
    setLoading(false);
  }
}

  const filtered = farmers.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.name?.toLowerCase().includes(q) ||
      f.phone?.toLowerCase().includes(q) ||
      f.email?.toLowerCase().includes(q) ||
      f.location?.toLowerCase().includes(q)
    );
  });

   async function handleDelete() {
  if (!toDelete) return;

  try {
    setDeleting(true);

    await API.delete(`/farmers/${toDelete.id}`);

    toast.success("Farmer deleted.");

    setFarmers((prev) =>
      prev.filter((f) => f.id !== toDelete.id)
    );

    setToDelete(null);
  } catch (err) {
    console.error(err);
    toast.error("Could not delete farmer.");
  } finally {
    setDeleting(false);
  }
}

  return (
    <div>
      <PageHeader title="Farmers" subtitle="Manage the farmers you work with.">
        <Link to="/farmers/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Farmer
        </Link>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-9"
            placeholder="Search by name, phone, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="text-sm text-ink-500">{filtered.length} farmer(s)</p>
      </div>

      {loading ? (
        <Spinner label="Loading farmers..." />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Sprout}
            title="No farmers found"
            message="Add your first farmer to start tracking your supply network."
            actionLabel="Add Farmer"
            actionTo="/farmers/new"
          />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Location</th>
                <th>Farm Size</th>
                <th>Added</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id}>
                  <td className="font-medium text-ink-800">{f.name}</td>
                  <td>{f.phone || "—"}</td>
                  <td>{f.email || "—"}</td>
                  <td>{f.location || "—"}</td>
                  <td>{f.farm_size || "—"}</td>
                  <td>{formatDate(f.created_at)}</td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/farmers/${f.id}`} className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 hover:text-primary-600" title="View">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link to={`/farmers/${f.id}/edit`} className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 hover:text-primary-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setToDelete(f)}
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
        title="Delete farmer?"
        message={`This will permanently remove "${toDelete?.name}". This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
