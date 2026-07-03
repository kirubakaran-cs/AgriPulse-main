import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, Pencil, Trash2, Package, Tag } from "lucide-react";
import API from "../../api/axios";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import ConfirmModal from "../../components/ConfirmModal";
import Spinner from "../../components/Spinner";
import CategoryModal from "../../components/CategoryModal";
import { formatCurrency } from "../../lib/format";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

   async function loadProducts() {
  setLoading(true);

  try {
    const res = await API.get("/products");

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.products || [];

    setProducts(data);

    // Create category list from products
    const cats = [
  ...new Set(
    data
      .map((p) => p.category)
      .filter((c) => c && c.trim() !== "")
  ),
].map((name) => ({
  id: name,
  name,
}));

    setCategories(cats);
  } catch (err) {
    console.error(err);
    toast.error("Could not load products.");
  } finally {
    setLoading(false);
  }
}

  const filtered = (Array.isArray(products) ? products : []).filter((p) => {
    const matchesSearch =
  (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
  (p.category || "").toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

   async function handleDelete() {
  if (!toDelete) return;

  setDeleting(true);

  try {
    await API.delete(`/products/${toDelete.id}`);

    toast.success("Product deleted.");

    setProducts((prev) =>
      prev.filter((p) => p.id !== toDelete.id)
    );

    setToDelete(null);
  } catch (err) {
    console.error(err);
    toast.error("Could not delete product.");
  } finally {
    setDeleting(false);
  }
} 
 

  return (
    <div>
      <PageHeader title="Products" subtitle="Manage your product catalog, stock, and categories.">
        <button className="btn-secondary" onClick={() => setCatModalOpen(true)}>
          <Tag className="h-4 w-4" /> Manage Categories
        </button>
        <Link to="/products/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-9"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-48"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
  <option key={c.name} value={c.name}>
    {c.name}
  </option>
))}
        </select>
      </div>

      {loading ? (
        <Spinner label="Loading products..." />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Package}
            title="No products found"
            message="Add your first product to start managing your catalog."
            actionLabel="Add Product"
            actionTo="/products/new"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <div key={p.id} className="card overflow-hidden">
            <div className="h-40 w-full bg-ink-100">
  <img
  src={
    p.image && p.image.trim() !== ""
      ? `http://localhost:5000/uploads/products/${p.image}`
      : "http://localhost:5000/uploads/products/default.jpeg"
  }
  alt={p.name}
  className="h-full w-full object-cover"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src =
      "http://localhost:5000/uploads/products/default.jpeg";
  }}
/>
</div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-ink-800">{p.name}</h3>
                 {p.category && (
  <span className="badge bg-primary-50 text-primary-600">
    {p.category}
  </span>
)}
                </div>
                <p className="mt-1 text-sm text-ink-500 line-clamp-2">
  {p.category || "No Category"}
</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-ink-800">{formatCurrency(p.price)}<span className="text-xs font-normal text-ink-400">/{p.unit || "Qty"}</span></p>
                    <p className={`text-xs ${Number(p.stock) > 0 ? "text-primary-600" : "text-red-500"}`}>
                      {Number(p.stock) > 0 ? `${p.stock} ${p.unit || "Qty"} in stock` : "Out of stock"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Link to={`/products/${p.id}/edit`} className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 hover:text-primary-600" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button onClick={() => setToDelete(p)} className="rounded-md p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!toDelete}
        title="Delete product?"
        message={`This will permanently remove "${toDelete?.name}". This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />

      <CategoryModal open={catModalOpen} onClose={() => setCatModalOpen(false)} onChanged={loadProducts} />
    </div>
  );
}
