import { useState } from "react";
import toast from "react-hot-toast";
import { User, Mail, Save, KeyRound, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";

export default function Profile() {
  const { user, updateProfile, changePassword, signOut } = useAuth();
  const navigate = useNavigate();

  const currentName = user?.fullName || "";
  const [nameForm, setNameForm] = useState({ fullName: currentName });
  const [savingName, setSavingName] = useState(false);

  const [pwForm, setPwForm] = useState({ newPassword: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);

  const handleNameSubmit = async (e) => {
    e.preventDefault();


    if (!nameForm.fullName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setSavingName(true);
    const { error } = await updateProfile({ fullName: nameForm.fullName.trim() });
    setSavingName(false);
    if (error) {
      toast.error(error.message || "Could not update profile.");
      return;
    }
    toast.success("Profile updated.");
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setSavingPw(true);
    const { error } = await changePassword({ newPassword: pwForm.newPassword });
    setSavingPw(false);
    if (error) {
      toast.error(error.message || "Could not change password.");
      return;
    }
    toast.success("Password changed.");
    setPwForm({ newPassword: "", confirm: "" });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <PageHeader title="Profile & Settings" subtitle="Manage your account details and security." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Profile info */}
        <div className="card p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-500 text-xl font-semibold text-white">
              {(currentName || user?.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink-800">{currentName || "User"}</h2>
              <p className="text-sm text-ink-500">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="fullName">Full name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="fullName"
                  className="input pl-9"
                  value={nameForm.fullName}
                  onChange={(e) => setNameForm({ fullName: e.target.value })}
                  placeholder="Your name"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  className="input pl-9 bg-ink-50"
                  value={user?.email || ""}
                  disabled
                />
              </div>
              <p className="mt-1 text-xs text-ink-400">Email cannot be changed here.</p>
            </div>
            <button type="submit" className="btn-primary" disabled={savingName}>
              <Save className="h-4 w-4" />
              {savingName ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="card p-6">
          <h2 className="mb-1 text-lg font-semibold text-ink-800">Change password</h2>
          <p className="mb-6 text-sm text-ink-500">Keep your account secure with a strong password.</p>

          <form onSubmit={handlePwSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="newPassword">New password</label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="newPassword"
                  type="password"
                  className="input pl-9"
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="confirmPw">Confirm new password</label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  id="confirmPw"
                  type="password"
                  className="input pl-9"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={savingPw}>
              <KeyRound className="h-4 w-4" />
              {savingPw ? "Updating..." : "Update password"}
            </button>
          </form>

          <div className="mt-8 border-t border-ink-100 pt-6">
            <button onClick={handleSignOut} className="btn-danger w-full">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
