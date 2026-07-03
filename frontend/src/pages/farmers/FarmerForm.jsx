import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";

// Shared add/edit form for a farmer. When :id is present we are editing.
export default function FarmerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    farm_size: "",
  });

  useEffect(() => {
  if (!isEdit) return;

  async function loadFarmer() {
    try {
      const res = await API.get(`/farmers/${id}`);

      setForm({
        name: res.data.name || "",
        phone: res.data.phone || "",
        email: res.data.email || "",
        location: res.data.location || "",
        farm_size: res.data.farm_size || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Farmer not found.");
      navigate("/farmers", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  loadFarmer();
}, [id, isEdit, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name.trim()) {
    toast.error("Name is required.");
    return;
  }

  const payload = {
    name: form.name.trim(),
    phone: form.phone.trim() || null,
    email: form.email.trim() || null,
    location: form.location.trim() || null,
    farm_size: form.farm_size.trim() || null,
  };

  try {
    setSaving(true);

    if (isEdit) {
      await API.put(`/farmers/${id}`, payload);
      toast.success("Farmer updated.");
    } else {
      await API.post("/farmers", payload);
      toast.success("Farmer added.");
    }

    navigate("/farmers");
  } catch (err) {
    console.error(err);
    toast.error("Could not save farmer.");
  } finally {
    setSaving(false);
  }
};

  if (loading) return <Spinner label="Loading farmer..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate("/farmers")}
        className="mb-4 flex items-center gap-1 text-sm text-ink-500 hover:text-ink-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to farmers
      </button>

      <div className="card p-6">
        <h1 className="text-xl font-bold text-ink-800">
          {isEdit ? "Edit Farmer" : "Add Farmer"}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {isEdit ? "Update the farmer's details." : "Enter the details of a new farmer."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label" htmlFor="name">Name *</label>
            <input id="name" name="name" className="input" value={form.name} onChange={handleChange} placeholder="e.g. John Miller" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} placeholder="+1 555 0100" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="input" value={form.email} onChange={handleChange} placeholder="john@farm.com" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="location">Location</label>
              <input id="location" name="location" className="input" value={form.location} onChange={handleChange} placeholder="Green Valley" />
            </div>
            <div>
              <label className="label" htmlFor="farm_size">Farm size</label>
              <input id="farm_size" name="farm_size" className="input" value={form.farm_size} onChange={handleChange} placeholder="e.g. 12 acres" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => navigate("/farmers")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : isEdit ? "Update Farmer" : "Add Farmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
