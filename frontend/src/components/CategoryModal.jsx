import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Plus, Trash2, Tag } from "lucide-react";
import api from "../api/axios";

// Modal to create and delete product categories.
export default function CategoryModal({ open, onClose, onChanged }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  // Load Categories
  async function loadCategories() {
    try {
      const { data } = await api.get("/categories");
      setCategories(data || []);
    } catch (err) {
      toast.error("Could not load categories.");
      console.error(err);
    }
  }

  // Add Category
  async function handleAdd(e) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/categories", {
        name: name.trim(),
        description: description.trim(),
      });

      toast.success("Category added.");

      setName("");
      setDescription("");

      loadCategories();
      onChanged?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not add category."
      );
    } finally {
      setLoading(false);
    }
  }

  // Delete Category
  async function handleDelete(cat) {
    try {
      await api.delete(`/categories/${cat.id}`);

      toast.success("Category deleted.");

      loadCategories();
      onChanged?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not delete category."
      );
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg animate-fade-in rounded-2xl bg-white p-6 shadow-cardHover">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink-800">
            Manage Categories
          </h3>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-ink-500 hover:bg-ink-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="mb-6 space-y-3">
          <div>
            <label className="label" htmlFor="catName">
              New category name
            </label>

            <input
              id="catName"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vegetables"
            />
          </div>

          <div>
            <label className="label" htmlFor="catDesc">
              Description (optional)
            </label>

            <input
              id="catDesc"
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </form>

        <div className="max-h-60 space-y-2 overflow-y-auto">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-ink-400">
              <Tag className="h-8 w-8" />
              <p className="text-sm">No categories yet.</p>
            </div>
          ) : (
            categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-ink-100 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink-800">
                    {c.name}
                  </p>

                  {c.description && (
                    <p className="text-xs text-ink-500">
                      {c.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(c)}
                  className="rounded-md p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}