import { useState, useEffect, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const C = {
  navy: "#0B2B4E", navyDark: "#071D35", green: "#2ECC8B", greenDark: "#22A872",
  greenLight: "#E8F9F2", text: "#1A1A2E", muted: "#6B7A99",
  border: "#DDE3EE", bg: "#F5F7FB", white: "#FFFFFF",
};

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: C.white, borderRadius: 12, padding: "1.25rem", border: `1px solid ${C.border}` }}>
      <p style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</p>
      <p style={{ fontSize: 32, fontWeight: 800, color: color || C.navy, lineHeight: 1 }}>{value ?? "—"}</p>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    paid: { bg: C.greenLight, color: C.greenDark, label: "Paid" },
    pending_review: { bg: "#FEF3C7", color: "#92400E", label: "Pending Review" },
    pending_payment: { bg: "#EDE9FE", color: "#5521B5", label: "Pending Payment" },
    rejected: { bg: "#FEE2E2", color: "#991B1B", label: "Rejected" },
  };
  const s = map[status] || map.pending_payment;
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>{s.label}</span>;
}

function exportCSV(rows) {
  const headers = ["Surname", "First Name", "Middle Name", "Institution", "Department", "Email", "Phone", "Presenter", "Type", "Certificate Name", "Status", "Proof URL", "Paid At", "Registered At"];
  const lines = rows.map(r => [
    r.surname, r.firstname, r.middlename, r.institution, r.department,
    r.email, r.phone, r.isPresenter, r.participationType,
    r.certificateName, r.paymentStatus, r.proofUrl || "",
    r.paidAt ? new Date(r.paidAt).toLocaleString() : "",
    new Date(r.createdAt).toLocaleString(),
  ].map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","));
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "pharmapool-registrations.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard({ token, onLogout }) {
  const [stats, setStats] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const headers = { "x-admin-token": token };

  const fetchStats = useCallback(async () => {
    const res = await fetch(`${API}/admin/stats`, { headers });
    const data = await res.json();
    if (data.ok) setStats(data.stats);
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);
    const res = await fetch(`${API}/admin/registrations?${params}`, { headers });
    const data = await res.json();
    if (data.ok) setRegistrations(data.registrations);
    setLoading(false);
  }, [search, statusFilter, typeFilter, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => {
    const t = setTimeout(fetchRegistrations, 300);
    return () => clearTimeout(t);
  }, [fetchRegistrations]);

  const handleApprove = async (id) => {
    setActionLoading(true);
    const res = await fetch(`${API}/admin/registrations/${id}/approve`, { method: "POST", headers });
    const data = await res.json();
    if (data.ok) {
      setSelected(null);
      fetchRegistrations();
      fetchStats();
    }
    setActionLoading(false);
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    const res = await fetch(`${API}/admin/registrations/${id}/reject`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ reason: rejectReason }),
    });
    const data = await res.json();
    if (data.ok) {
      setSelected(null);
      setRejectReason("");
      setShowRejectInput(false);
      fetchRegistrations();
      fetchStats();
    }
    setActionLoading(false);
  };

  const inputStyle = { padding: "8px 12px", fontSize: 13, borderRadius: 8, border: `1px solid ${C.border}`, outline: "none", background: C.white };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.navyDark, padding: "0 1.5rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.navyDark }}>P</div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>Pharmapool Admin</span>
        </div>
        <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.7)", padding: "6px 14px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Logout</button>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard label="Total" value={stats?.total} />
          <StatCard label="Paid" value={stats?.paid} color={C.greenDark} />
          <StatCard label="Pending Review" value={stats?.pending_review} color="#92400E" />
          <StatCard label="Pending Payment" value={stats?.pending_payment} color="#5521B5" />
          <StatCard label="Rejected" value={stats?.rejected} color="#991B1B" />
          <StatCard label="Nigerian (paid)" value={stats?.nigerian} />
          <StatCard label="International (paid)" value={stats?.international} />
        </div>

        {/* Toolbar */}
        <div style={{ background: C.white, borderRadius: 12, padding: "1rem 1.25rem", border: `1px solid ${C.border}`, marginBottom: "1rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <input style={{ ...inputStyle, flex: 1, minWidth: 200 }} placeholder="Search name, email, institution…" value={search} onChange={e => setSearch(e.target.value)} />
          <select style={{ ...inputStyle, cursor: "pointer" }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending_review">Pending Review</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="rejected">Rejected</option>
          </select>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            <option value="nigerian">Nigerian</option>
            <option value="international">International</option>
          </select>
          <button onClick={() => exportCSV(registrations)} style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Export CSV</button>
        </div>

        {/* Table */}
        <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                  {["Name", "Email", "Institution", "Type", "Status", "Registered", ""].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: C.muted }}>Loading…</td></tr>
                ) : registrations.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: C.muted }}>No registrations found</td></tr>
                ) : registrations.map((r, i) => (
                  <tr key={r._id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : C.bg }}>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: C.navy, whiteSpace: "nowrap" }}>{r.surname} {r.firstname}</td>
                    <td style={{ padding: "10px 14px", color: C.muted }}>{r.email}</td>
                    <td style={{ padding: "10px 14px", color: C.text, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.institution}</td>
                    <td style={{ padding: "10px 14px", color: C.muted, textTransform: "capitalize" }}>{r.participationType}</td>
                    <td style={{ padding: "10px 14px" }}><Badge status={r.paymentStatus} /></td>
                    <td style={{ padding: "10px 14px", color: C.muted, whiteSpace: "nowrap" }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <button onClick={() => { setSelected(r); setShowRejectInput(false); setRejectReason(""); }}
                        style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", color: C.navy, fontWeight: 600 }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && <p style={{ padding: "10px 14px", fontSize: 12, color: C.muted, borderTop: `1px solid ${C.border}` }}>{registrations.length} record{registrations.length !== 1 ? "s" : ""}</p>}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: 0 }}>{selected.surname} {selected.firstname}</h2>
                <div style={{ marginTop: 6 }}><Badge status={selected.paymentStatus} /></div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted }}>×</button>
            </div>

            {/* Registration details */}
            {[
              ["Full Name", `${selected.surname} ${selected.firstname} ${selected.middlename || ""}`.trim()],
              ["Email", selected.email],
              ["Phone", selected.phone],
              ["Institution", selected.institution],
              ["Department", selected.department || "—"],
              ["Presenter", selected.isPresenter],
              ["Participation", selected.participationType],
              ["Certificate Name", selected.certificateName],
              ["Amount Due", selected.currency === "NGN" ? "₦30,000" : "$50"],
              ["Registered At", new Date(selected.createdAt).toLocaleString()],
              ["Paid At", selected.paidAt ? new Date(selected.paidAt).toLocaleString() : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, minWidth: 130 }}>{k}</span>
                <span style={{ fontSize: 13, color: C.text }}>{v}</span>
              </div>
            ))}

            {/* Proof of payment image */}
            {selected.proofUrl && (
              <div style={{ marginTop: "1.25rem" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Payment Proof</p>
                {selected.proofUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img src={selected.proofUrl} alt="Payment proof" style={{ width: "100%", borderRadius: 10, border: `1px solid ${C.border}`, display: "block" }} />
                ) : (
                  <a href={selected.proofUrl} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 16px", fontSize: 13, color: C.navy, fontWeight: 600, textDecoration: "none" }}>
                    📄 View PDF Receipt
                  </a>
                )}
              </div>
            )}

            {/* Approve / Reject actions */}
            {selected.paymentStatus === "pending_review" && (
              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={() => handleApprove(selected._id)} disabled={actionLoading}
                  style={{ background: C.green, color: C.navyDark, border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: actionLoading ? 0.7 : 1 }}>
                  {actionLoading ? "Processing…" : "✓ Approve Registration"}
                </button>
                {!showRejectInput ? (
                  <button onClick={() => setShowRejectInput(true)}
                    style={{ background: "#FEE2E2", color: "#991B1B", border: "1px solid #FECACA", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    ✕ Reject
                  </button>
                ) : (
                  <div>
                    <input
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection (required)"
                      style={{ width: "100%", padding: "10px 12px", fontSize: 13, borderRadius: 8, border: `1px solid ${C.border}`, outline: "none", boxSizing: "border-box", marginBottom: 8 }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleReject(selected._id)} disabled={actionLoading || !rejectReason.trim()}
                        style={{ flex: 1, background: "#991B1B", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer", opacity: !rejectReason.trim() ? 0.5 : 1 }}>
                        Confirm Reject
                      </button>
                      <button onClick={() => { setShowRejectInput(false); setRejectReason(""); }}
                        style={{ flex: 1, background: C.bg, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px", fontSize: 13, cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
