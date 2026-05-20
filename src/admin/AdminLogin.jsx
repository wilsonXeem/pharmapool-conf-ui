import { useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const C = {
  navy: "#0B2B4E", navyDark: "#071D35", green: "#2ECC8B",
  border: "#DDE3EE", muted: "#6B7A99", bg: "#F5F7FB", white: "#FFFFFF",
};

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error || "Invalid password"); return; }
      localStorage.setItem("adminToken", data.token);
      onLogin(data.token);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.navyDark, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: C.white, borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: 22 }}>🔐</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: C.navy, margin: 0 }}>Admin Login</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Pharmapool Conference 2026</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{ width: "100%", padding: "10px 12px", fontSize: 14, borderRadius: 8, border: `1px solid ${error ? "#E53E3E" : C.border}`, outline: "none", boxSizing: "border-box" }}
            />
            {error && <p style={{ fontSize: 12, color: "#E53E3E", marginTop: 4 }}>{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
