import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";

export default function BuyerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    address: "",
  });

 useEffect(() => {
  if (!isEdit) {
    setLoading(false);
    return;
  }

  async function loadBuyer() {
    try {
      const res = await API.get(`/buyers/${id}`);

      setForm({
        name: res.data.name || "",
        company: res.data.company || "",
        phone: res.data.phone || "",
        email: res.data.email || "",
        address: res.data.address || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Buyer not found.");
      navigate("/buyers", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  loadBuyer();
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
    company: form.company.trim() || null,
    phone: form.phone.trim() || null,
    email: form.email.trim() || null,
    address: form.address.trim() || null,
  };

  try {
    setSaving(true);

    if (isEdit) {
      await API.put(`/buyers/${id}`, payload);
      toast.success("Buyer updated.");
    } else {
      await API.post("/buyers", payload);
      toast.success("Buyer added.");
    }

    navigate("/buyers");
  } catch (err) {
    console.error(err);
    toast.error("Could not save buyer.");
  } finally {
    setSaving(false);
  }
};

  if (loading) return <Spinner label="Loading buyer..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={() => navigate("/buyers")}
        className="mb-4 flex items-center gap-1 text-sm text-ink-500 hover:text-ink-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to buyers
      </button>

      <div className="card p-6">
        <h1 className="text-xl font-bold text-ink-800">
          {isEdit ? "Edit Buyer" : "Add Buyer"}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {isEdit ? "Update the buyer's details." : "Enter the details of a new buyer."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Name *</label>
              <input id="name" name="name" className="input" value={form.name} onChange={handleChange} placeholder="e.g. Sarah Connor" />
            </div>
            <div>
              <label className="label" htmlFor="company">Company</label>
              <input id="company" name="company" className="input" value={form.company} onChange={handleChange} placeholder="FreshMart Ltd." />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className="input" value={form.phone} onChange={handleChange} placeholder="+1 555 0200" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="input" value={form.email} onChange={handleChange} placeholder="sarah@freshmart.com" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              className="input"
              value={form.address}
              onChange={handleChange}
              placeholder="123 Market Street, Springfield"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => navigate("/buyers")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : isEdit ? "Update Buyer" : "Add Buyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
