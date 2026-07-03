import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";

const UNITS = ["kg", "g", "lb", "ton", "piece", "bunch", "bag", "crate", "litre"];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    unit: "kg",
    price: "",
    stock: "",
    image_url: "",
    description: "",
  });

  useEffect(() => {
  loadData();
}, [id]);

async function loadData() {
  try {
    setLoading(true);

    // Load categories
    const catRes = await API.get("/categories");
    setCategories(catRes.data || []);

    if (isEdit) {
      const productRes = await API.get(`/products/${id}`);
      const p = productRes.data;

     setForm({
  name: p.product_name || p.name || "",
  category_id: p.category_id || "",
  unit: p.unit || "kg",
  price: p.price || "",
  stock: p.stock || "",
  image_url: p.image || "",
  description: p.description || "",
});
    }
  } catch (err) {
    console.error(err);
    toast.error("Could not load product.");
  } finally {
    setLoading(false);
  }
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name.trim()) {
    toast.error("Product name is required.");
    return;
  }

  const payload = {
    product_name: form.name.trim(),
    category_id: Number(form.category_id),
    unit: form.unit,
    price: Number(form.price),
    stock: Number(form.stock),
    image: form.image_url.trim(),
    description: form.description.trim(),
  };

  try {
    setSaving(true);

    if (isEdit) {
      await API.put(`/products/${id}`, payload);
      toast.success("Product updated.");
    } else {
      await API.post("/products", payload);
      toast.success("Product added.");
    }

    navigate("/products");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Insert failed");
  } finally {
    setSaving(false);
  }
};

  if (loading) return <Spinner label="Loading product..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate("/products")}
        className="mb-4 flex items-center gap-1 text-sm text-ink-500 hover:text-ink-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </button>

      <div className="card p-6">
        <h1 className="text-xl font-bold text-ink-800">
          {isEdit ? "Edit Product" : "Add Product"}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {isEdit ? "Update the product details." : "Enter the details of a new product."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="name">Name *</label>
            <input id="name" name="name" className="input" value={form.name} onChange={handleChange} placeholder="e.g. Organic Tomatoes" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="category_id">Category</label>
              <select id="category_id" name="category_id" className="input" value={form.category_id} onChange={handleChange}>
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="unit">Unit</label>
              <select id="unit" name="unit" className="input" value={form.unit} onChange={handleChange}>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="price">Price (per unit) *</label>
              <input id="price" name="price" type="number" step="0.01" min="0" className="input" value={form.price} onChange={handleChange} placeholder="0.00" />
            </div>
            <div>
              <label className="label" htmlFor="stock">Stock quantity</label>
              <input id="stock" name="stock" type="number" step="0.01" min="0" className="input" value={form.stock} onChange={handleChange} placeholder="0" />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="image_url">Image URL</label>
            <input id="image_url" name="image_url" className="input" value={form.image_url} onChange={handleChange} placeholder="https://images.example.com/tomato.jpg" />
            <p className="mt-1 text-xs text-ink-400">Paste a direct link to a product image.</p>
          </div>

          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={3} className="input" value={form.description} onChange={handleChange} placeholder="Short description of the product" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => navigate("/products")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
