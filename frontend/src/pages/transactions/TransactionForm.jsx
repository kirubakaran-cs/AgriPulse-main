import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import { formatCurrency } from "../../lib/format";

export default function TransactionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    type: "BUY",
    farmer_id: "",
    buyer_id: "",
    product_id: "",
    quantity: "",
    unit_price: "",
    status: "COMPLETED",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      const [farmersRes, buyersRes, productsRes] = await Promise.all([
        API.get("/farmers"),
        API.get("/buyers"),
        API.get("/products"),
      ]);

      setFarmers(farmersRes.data || []);
      setBuyers(buyersRes.data || []);
      setProducts(productsRes.data || []);

      if (isEdit) {
        const res = await API.get(`/transactions/${id}`);

        const t = res.data;

        setForm({
          type: t.type || "BUY",
          farmer_id: t.farmer_id || "",
          buyer_id: t.buyer_id || "",
          product_id: t.product_id || "",
          quantity: t.quantity || "",
          unit_price: t.unit_price || "",
          status: t.status || "COMPLETED",
          date: t.date
            ? t.date.substring(0, 10)
            : new Date().toISOString().slice(0, 10),
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    const updated = {
      ...form,
      [name]: value,
    };

    if (name === "product_id") {
      const product = products.find(
        (p) => String(p.id) === String(value)
      );

      if (product) {
        updated.unit_price = product.price;
      }
    }

    setForm(updated);
  }

  const total =
    (Number(form.quantity) || 0) *
    (Number(form.unit_price) || 0);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.product_id) {
      toast.error("Select a product.");
      return;
    }

    if (form.type === "BUY" && !form.farmer_id) {
      toast.error("Select a farmer.");
      return;
    }

    if (form.type === "SELL" && !form.buyer_id) {
      toast.error("Select a buyer.");
      return;
    }

    const payload = {
      type: form.type,
      farmer_id:
        form.type === "BUY" ? form.farmer_id : null,
      buyer_id:
        form.type === "SELL" ? form.buyer_id : null,
      product_id: form.product_id,
      quantity: Number(form.quantity),
      unit_price: Number(form.unit_price),
      total_amount: total,
      status: form.status,
      date: form.date,
    };

    try {
      setSaving(true);

      if (isEdit) {
        await API.put(`/transactions/${id}`, payload);
        toast.success("Transaction updated.");
      } else {
        await API.post("/transactions", payload);
        toast.success("Transaction added.");
      }

      navigate("/transactions");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Could not save transaction."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Spinner label="Loading transaction..." />;
  }

  return (
    <div className="mx-auto max-w-2xl">

      <button
        onClick={() => navigate("/transactions")}
        className="mb-4 flex items-center gap-2 text-sm"
      >
        <ArrowLeft size={18} />
        Back to Transactions
      </button>

      <div className="card p-6">

        <h2 className="text-2xl font-bold">
          {isEdit ? "Edit Transaction" : "New Transaction"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >

          <div>
            <label>Transaction Type</label>

            <select
              className="input"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="BUY">
                Buy From Farmer
              </option>

              <option value="SELL">
                Sell To Buyer
              </option>
            </select>
          </div>

          <div>
            <label>Product</label>

            <select
              className="input"
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
            >
              <option value="">
                Select Product
              </option>

              {products.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.name} ({p.unit})
                </option>
              ))}
            </select>
          </div>

          {form.type === "BUY" ? (
            <div>

              <label>Farmer</label>

              <select
                className="input"
                name="farmer_id"
                value={form.farmer_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Farmer
                </option>

                {farmers.map((f) => (
                  <option
                    key={f.id}
                    value={f.id}
                  >
                    {f.full_name || f.name}
                  </option>
                ))}
              </select>

            </div>
          ) : (
            <div>

              <label>Buyer</label>

              <select
                className="input"
                name="buyer_id"
                value={form.buyer_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Buyer
                </option>

                {buyers.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                  >
                    {b.full_name || b.name}
                  </option>
                ))}
              </select>

            </div>
          )}

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label>Quantity</label>

              <input
                className="input"
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
              />

            </div>

            <div>

              <label>Unit Price</label>

              <input
                className="input"
                type="number"
                name="unit_price"
                value={form.unit_price}
                onChange={handleChange}
              />

            </div>

          </div>

          <div>

            <label>Date</label>

            <input
              className="input"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

          </div>

          <div>

            <label>Status</label>

            <select
              className="input"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="COMPLETED">
                Completed
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>

          </div>

          <div className="rounded bg-green-50 p-4">

            <div className="flex justify-between">

              <span>Total Amount</span>

              <strong>
                {formatCurrency(total)}
              </strong>

            </div>

          </div>

          <button
            className="btn-primary w-full"
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />

            {saving
              ? "Saving..."
              : isEdit
              ? "Update Transaction"
              : "Save Transaction"}

          </button>

        </form>

      </div>

    </div>
  );
}