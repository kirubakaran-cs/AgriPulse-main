import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Pencil,
  Phone,
  Mail,
  MapPin,
  Sprout,
  ArrowLeftRight,
} from "lucide-react";
import API from "../../api/axios";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";
import { formatDate, formatCurrency } from "../../lib/format";

export default function FarmerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  loadFarmer();
}, [id]);

async function loadFarmer() {
  try {
    setLoading(true);

   const farmerRes = await API.get(`/farmers/${id}`);

setFarmer(farmerRes.data);
setTransactions([]);

  } catch (err) {
    console.error(err);
    toast.error("Farmer not found.");
    navigate("/farmers", { replace: true });
  } finally {
    setLoading(false);
  }
}

  if (loading) return <Spinner label="Loading farmer..." />;

  const totalBought = transactions
    .filter((t) => t.type === "BUY")
    .reduce((s, t) => s + Number(t.total_amount || 0), 0);

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={() => navigate("/farmers")}
        className="mb-4 flex items-center gap-1 text-sm text-ink-500 hover:text-ink-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to farmers
      </button>

      <div className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Sprout className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-800">{farmer.name}</h1>
              <p className="text-sm text-ink-500">Added {formatDate(farmer.created_at)}</p>
            </div>
          </div>
          <Link to={`/farmers/${farmer.id}/edit`} className="btn-secondary">
            <Pencil className="h-4 w-4" /> Edit
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow icon={Phone} label="Phone" value={farmer.phone} />
          <InfoRow icon={Mail} label="Email" value={farmer.email} />
          <InfoRow icon={MapPin} label="Location" value={farmer.location} />
          <InfoRow icon={Sprout} label="Farm size" value={farmer.farm_size} />
        </div>
      </div>

      <div className="mt-6 card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-800">Transactions with this farmer</h2>
          <p className="text-sm text-ink-500">
            Total purchases: <span className="font-semibold text-ink-700">{formatCurrency(totalBought)}</span>
          </p>
        </div>

        {transactions.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions yet"
            message="Record a BUY transaction with this farmer to see it here."
            actionLabel="Add transaction"
            actionTo="/transactions/new"
          />
        ) : (
          <div className="table-wrap border-0 shadow-none">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span className={`badge ${t.type === "BUY" ? "bg-blue-50 text-blue-600" : "bg-primary-50 text-primary-600"}`}>
                        {t.type}
                      </span>
                    </td>
                    <td>{t.product_name || "—"}</td>
                    <td className="font-medium">{formatCurrency(t.total_amount)}</td>
                    <td>
                      <span className={`badge ${t.status === "COMPLETED" ? "bg-primary-50 text-primary-600" : t.status === "PENDING" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>{formatDate(t.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-ink-100 p-3">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-ink-50 text-ink-500">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
        <p className="text-sm text-ink-800">{value || "—"}</p>
      </div>
    </div>
  );
}
