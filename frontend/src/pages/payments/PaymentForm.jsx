import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";

const METHODS = [
  "CASH",
  "BANK_TRANSFER",
  "MOBILE_MONEY",
  "CHEQUE",
  "OTHER",
];

export default function PaymentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const [form, setForm] = useState({
    transaction_id: "",
    amount: "",
    method: "CASH",
    status: "PENDING",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);

      // Load transactions
      const txRes = await API.get("/transactions");
      setTransactions(txRes.data || []);

      // Load payment while editing
      if (isEdit) {
        const payRes = await API.get(`/payments/${id}`);
        const data = payRes.data;

        setForm({
          transaction_id: data.transaction_id || "",
          amount: data.amount || "",
          method: data.method || "CASH",
          status: data.status || "PENDING",
          date: data.date
            ? data.date.substring(0, 10)
            : new Date().toISOString().slice(0, 10),
          note: data.note || "",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payment.");

      if (isEdit) {
        navigate("/payments");
      }
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

    if (name === "transaction_id") {
      const tx = transactions.find(
        (t) => String(t.id) === String(value)
      );

      if (tx && !form.amount) {
        updated.amount = tx.total_amount;
      }
    }

    setForm(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const payload = {
      transaction_id: form.transaction_id || null,
      amount: Number(form.amount),
      method: form.method,
      status: form.status,
      date: form.date,
      note: form.note.trim(),
    };

    try {
      setSaving(true);

      if (isEdit) {
        await API.put(`/payments/${id}`, payload);
        toast.success("Payment updated successfully.");
      } else {
        await API.post("/payments", payload);
        toast.success("Payment recorded successfully.");
      }

      navigate("/payments");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Could not save payment."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Spinner label="Loading payment..." />;
  }

  return (
    <div className="mx-auto max-w-2xl">

      <button
        onClick={() => navigate("/payments")}
        className="mb-4 flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Payments
      </button>

      <div className="card p-6">

        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Payment" : "Record Payment"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          <div>

            <label className="label">
              Linked Transaction
            </label>

            <select
              className="input"
              name="transaction_id"
              value={form.transaction_id}
              onChange={handleChange}
            >
              <option value="">
                No linked transaction
              </option>

              {transactions.map((t) => (
                <option
                  key={t.id}
                  value={t.id}
                >
                  {t.product_name || "Transaction"} |{" "}
                  {t.type} | ₹{t.total_amount}
                </option>
              ))}

            </select>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="label">
                Amount
              </label>

              <input
                className="input"
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
              />

            </div>

            <div>

              <label className="label">
                Date
              </label>

              <input
                className="input"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="label">
                Method
              </label>

              <select
                className="input"
                name="method"
                value={form.method}
                onChange={handleChange}
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m.replaceAll("_", " ")}
                  </option>
                ))}
              </select>

            </div>

            <div>

              <label className="label">
                Status
              </label>

              <select
                className="input"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
              </select>

            </div>

          </div>

          <div>

            <label className="label">
              Note
            </label>

            <textarea
              rows="3"
              className="input"
              name="note"
              value={form.note}
              onChange={handleChange}
            />

          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/payments")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              <Save className="h-4 w-4" />

              {saving
                ? "Saving..."
                : isEdit
                ? "Update Payment"
                : "Record Payment"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}