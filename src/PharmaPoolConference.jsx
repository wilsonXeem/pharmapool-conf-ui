import { useState, useEffect, useRef } from "react";
import logo from "./logo.png";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const COLORS = {
  navy: "#0B2B4E", navyDark: "#071D35", navyMid: "#0D3B6E",
  green: "#2ECC8B", greenDark: "#22A872", greenLight: "#E8F9F2",
  text: "#1A1A2E", muted: "#6B7A99", border: "#DDE3EE",
  bg: "#F5F7FB", white: "#FFFFFF", gold: "#F6C90E",
};

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80",
  theme: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&q=80",
  lab: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80",
  workshop: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80",
};

const SPEAKERS = [
  { initials: "HKP", name: "Prof. Hirak K. Patra", role: "Precision Nanosystems and Advanced Therapeutics", org: "University College London, UK" },
  { initials: "SH", name: "Dr. Susan Heavey", role: "Associate Professor of Translational Medicine, Division of Surgery & Interventional Science", org: "University College London, UK" },
  { initials: "UO", name: "Dr. Uzoamaka Okoli", role: "Basic & Translational Cancer Research Group, College of Medicine, UNN; Division of Surgery & Interventional Science", org: "University College London, UK" },
  { initials: "MA", name: "Prof. Maxwell Adibe", role: "Dept. of Clinical Pharmacy and Pharmacy Management", org: "University of Nigeria, Nsukka" },
  { initials: "NO", name: "Dr. Nwamaka Osakwe", role: "Consultant Nephrologist and Medical Writer", org: "Federal Medical Centre, Asaba, Delta State" },
  { initials: "OOK", name: "Prof. Olobayo O. Kunle", role: "WHO Expert in Herbal Medicines", org: "National Institute for Pharmaceutical Research and Development" },
  { initials: "UKO", name: "Dr. Ugwu Kenneth Okonkwo", role: "Dept. of Microbiology", org: "University of Nigeria, Nsukka" },
  { initials: "DH", name: "Dr. Donald Harting", role: "Medical Writer", org: "Harting Communication LLC, USA" },
  { initials: "COA", name: "Prof. Chukwuma O. Agubata", role: "Fulbright Visiting Scholar; Winner, Nigeria Prize for Science (2017)", org: "University of Nigeria, Nsukka" },
  { initials: "CC", name: "Dr. Clifford Chuwah", role: "Executive Publishing Editor", org: "Springer Nature" },
  { initials: "VM", name: "Vuyo Mliswa", role: "Academic Affairs Manager, Africa", org: "Springer Nature" },
];

const SUBTHEMES = [
  "Innovations in medical practice",
  "Pharmaceutical care and interventions",
  "Novel pharmaceutical and biological products",
  "Health sciences and related research",
  "Exploring life sciences research for improved Quality of Life (QoL)",
  "Nutrition, water and environment: Finding a balance for sustainable growth",
  "Good laboratory and manufacturing practices",
];

const WORKSHOPS = [
  "Medical writing",
  "Application of artificial intelligence (AI) in health-related research",
  "Grant writing",
  "Publishing (Springer Nature)",
];

const AVATAR_COLORS = [
  ["#E8F0FE", "#1A56DB"], ["#E8F9F2", "#0B7B5B"], ["#FEF3C7", "#92400E"],
  ["#FDE8F0", "#9D174D"], ["#EDE9FE", "#5521B5"], ["#FEE2E2", "#991B1B"],
];

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

function useCountdown(target) {
  const [time, setTime] = useState({});
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target) - new Date();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

function SectionHeader({ label, title, centered }) {
  return (
    <div style={{ textAlign: centered ? "center" : "left" }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: COLORS.green, textTransform: "uppercase" }}>{label}</span>
      <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: COLORS.navy, marginTop: 6, fontFamily: "'Georgia', serif", lineHeight: 1.2 }}>{title}</h2>
    </div>
  );
}

// ── Nav
function Nav({ active, onNav }) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Home", "Speakers", "Programme", "Register", "Abstract", "Contact"];
  const handleNav = (page) => { onNav(page); setMenuOpen(false); };
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,29,53,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(46,204,139,0.15)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => handleNav("home")}>
          <img src={logo} alt="Pharmapool" style={{ height: 36, width: 36, objectFit: "contain" }} />
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Pharmapool Conference</div>
            <div style={{ color: COLORS.green, fontSize: 10, fontWeight: 600, letterSpacing: 1.2 }}>JULY 1–2, 2026 · VIRTUAL</div>
          </div>
        </div>
        {!isMobile && (
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {links.map(l => (
              <button key={l} onClick={() => handleNav(l.toLowerCase())}
                style={{ background: active === l.toLowerCase() ? "rgba(46,204,139,0.12)" : "transparent", border: active === l.toLowerCase() ? "1px solid rgba(46,204,139,0.3)" : "1px solid transparent", color: active === l.toLowerCase() ? COLORS.green : "rgba(255,255,255,0.65)", padding: "6px 13px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontWeight: active === l.toLowerCase() ? 600 : 400, transition: "all 0.15s" }}>{l}</button>
            ))}
            <button onClick={() => handleNav("register")} style={{ marginLeft: 8, background: COLORS.green, color: COLORS.navyDark, border: "none", borderRadius: 6, padding: "7px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Register</button>
          </div>
        )}
        {isMobile && (
          <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ display: "block", width: 22, height: 2, background: menuOpen ? COLORS.green : "rgba(255,255,255,0.8)", borderRadius: 2 }} />)}
          </button>
        )}
      </div>
      {isMobile && menuOpen && (
        <div style={{ background: COLORS.navyDark, borderTop: "1px solid rgba(255,255,255,0.08)", padding: "0.75rem 1.25rem 1rem" }}>
          {links.map(l => (
            <button key={l} onClick={() => handleNav(l.toLowerCase())} style={{ display: "block", width: "100%", textAlign: "left", background: active === l.toLowerCase() ? "rgba(46,204,139,0.1)" : "transparent", border: "none", color: active === l.toLowerCase() ? COLORS.green : "rgba(255,255,255,0.75)", padding: "11px 12px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: active === l.toLowerCase() ? 600 : 400, marginBottom: 2 }}>{l}</button>
          ))}
          <button onClick={() => handleNav("register")} style={{ display: "block", width: "100%", marginTop: 8, background: COLORS.green, color: COLORS.navyDark, border: "none", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Register Now</button>
        </div>
      )}
    </nav>
  );
}

// ── Hero
function Hero({ onNav }) {
  const time = useCountdown("2026-07-01T08:00:00");
  return (
    <section style={{ position: "relative", overflow: "hidden", minHeight: 620 }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${IMAGES.hero})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.25)" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${COLORS.navyDark} 0%, rgba(11,43,78,0.85) 50%, rgba(11,77,92,0.8) 100%)` }} />
      <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "5rem 2rem 4rem", textAlign: "center" }}>
        <img src={logo} alt="Pharmapool" style={{ height: 90, width: 90, objectFit: "contain", filter: "drop-shadow(0 4px 24px rgba(46,204,139,0.3))", display: "block", margin: "0 auto 1.75rem" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(46,204,139,0.12)", border: "1px solid rgba(46,204,139,0.35)", borderRadius: 24, padding: "7px 18px", marginBottom: "1.75rem" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.green, display: "inline-block", boxShadow: "0 0 8px #2ECC8B" }} />
          <span style={{ color: COLORS.green, fontSize: 12, fontWeight: 700, letterSpacing: 1.5 }}>VIRTUAL · JULY 1–2, 2026</span>
        </div>
        <h1 style={{ fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 800, color: "#fff", lineHeight: 1.12, marginBottom: "1.25rem", fontFamily: "'Georgia', serif", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
          National Conference &amp; Workshop on<br />
          <span style={{ color: COLORS.green }}>Health-Related Research</span>
        </h1>
        <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "1rem 2rem", maxWidth: 640, margin: "0 auto 2.5rem", backdropFilter: "blur(8px)" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Conference Theme</p>
          <p style={{ color: "#fff", fontSize: 18, fontWeight: 600, lineHeight: 1.5, fontStyle: "italic", margin: 0 }}>"Impact of health-related translational research on Quality of Life"</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          {[["d", "Days"], ["h", "Hours"], ["m", "Mins"], ["s", "Secs"]].map(([k, label]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 22px", minWidth: 76, textAlign: "center", backdropFilter: "blur(8px)" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.green, lineHeight: 1 }}>{String(time[k] ?? 0).padStart(2, "0")}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 5, letterSpacing: 1.5, fontWeight: 600 }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
          <button onClick={() => onNav("register")} style={{ background: COLORS.green, color: COLORS.navyDark, border: "none", borderRadius: 8, padding: "15px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(46,204,139,0.35)" }}>Register Now →</button>
          <button onClick={() => onNav("abstract")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 8, padding: "15px 36px", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Submit Abstract</button>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: "0.75rem" }}>In Partnership With</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
            {["GMP Research Group, UNN", "Basic & Translational Cancer Research Group, UNN", "Springer Nature"].map(p => (
              <span key={p} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Theme Section
function ThemeSection() {
  return (
    <section style={{ background: COLORS.white, padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLORS.green, textTransform: "uppercase" }}>About the Conference</span>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: COLORS.navy, marginTop: 8, marginBottom: "1.25rem", fontFamily: "'Georgia', serif", lineHeight: 1.25 }}>Bridging Research &amp;<br />Quality of Life</h2>
          <p style={{ fontSize: 15, color: COLORS.muted, lineHeight: 1.8, marginBottom: "1.5rem" }}>This national conference brings together researchers, clinicians, pharmacists, and health scientists to explore how translational research directly improves patient outcomes and quality of life across Africa and beyond.</p>
          <p style={{ fontSize: 15, color: COLORS.muted, lineHeight: 1.8, marginBottom: "2rem" }}>Hosted by <strong style={{ color: COLORS.navy }}>Pharmapool Synergy Solutions Nig. Ltd</strong> in partnership with the GMP Research Group and Basic &amp; Translational Cancer Research Group at the University of Nigeria, Nsukka, and <strong style={{ color: COLORS.navy }}>Springer Nature</strong>.</p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[["11+", "Expert Speakers"], ["7", "Subthemes"], ["4", "Workshops"], ["2", "Days"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.green }}>{n}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <img src={IMAGES.theme} alt="Research" style={{ width: "100%", borderRadius: 20, objectFit: "cover", height: 420, display: "block", boxShadow: "0 20px 60px rgba(11,43,78,0.15)" }} />
          <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, background: "rgba(7,29,53,0.88)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "1rem 1.25rem", border: "1px solid rgba(46,204,139,0.2)" }}>
            <p style={{ color: COLORS.green, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Conference Theme</p>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>"Impact of health-related translational research on Quality of Life"</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Programme
function Programme() {
  return (
    <section style={{ padding: "5rem 2rem", background: COLORS.bg }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <SectionHeader label="Programme" title="Subthemes & Workshops" centered />
          <p style={{ fontSize: 15, color: COLORS.muted, marginTop: 12, maxWidth: 560, margin: "12px auto 0" }}>Two days of cutting-edge presentations, panel discussions, and hands-on workshops.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          <div style={{ background: COLORS.white, borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(11,43,78,0.07)", border: `1px solid ${COLORS.border}` }}>
            <div style={{ background: COLORS.navy, padding: "1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(46,204,139,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📋</div>
              <div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Conference</p>
                <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: 0 }}>Subthemes</p>
              </div>
            </div>
            <div style={{ padding: "1.5rem" }}>
              {SUBTHEMES.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < SUBTHEMES.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: COLORS.greenLight, color: COLORS.greenDark, fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                  <span style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6, fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ background: COLORS.white, borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(11,43,78,0.07)", border: `1px solid ${COLORS.border}` }}>
              <div style={{ background: COLORS.greenDark, padding: "1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛠</div>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: 0 }}>Hands-on</p>
                  <p style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: 0 }}>Workshop Sessions</p>
                </div>
              </div>
              <div style={{ padding: "1.5rem" }}>
                {WORKSHOPS.map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: i < WORKSHOPS.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.5, fontWeight: 500 }}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", minHeight: 160 }}>
              <img src={IMAGES.workshop} alt="Workshop" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, filter: "brightness(0.35)" }} />
              <div style={{ position: "relative", padding: "1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ color: COLORS.green, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 4px" }}>Event Date</p>
                  <p style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: 0, fontFamily: "'Georgia', serif" }}>July 1–2, 2026</p>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "4px 0 0" }}>Virtual · Online attendance only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Speakers
function Speakers() {
  return (
    <section style={{ padding: "5rem 2rem", background: COLORS.white }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "3rem", alignItems: "center", marginBottom: "3rem" }}>
          <div>
            <SectionHeader label="Keynote Speakers" title="Meet the Experts" />
            <p style={{ fontSize: 15, color: COLORS.muted, lineHeight: 1.8, marginTop: 12 }}>World-class researchers, clinicians, and publishing experts from leading institutions across Africa, Europe, and the USA.</p>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", height: 220, position: "relative" }}>
            <img src={IMAGES.lab} alt="Laboratory research" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(11,43,78,0.7) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 20, left: 24 }}>
              <p style={{ color: COLORS.green, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 4px" }}>Featuring</p>
              <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>11 Expert Speakers</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: "2px 0 0" }}>UCL · UNN · Springer Nature · NIPRD</p>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.25rem" }}>
          {SPEAKERS.map((s, i) => {
            const [bg, fg] = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <div key={i} style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "1.5rem", transition: "all 0.2s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(11,43,78,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = COLORS.green; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = COLORS.border; }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, marginBottom: 14 }}>{s.initials}</div>
                <p style={{ fontWeight: 700, fontSize: 14, color: COLORS.navy, marginBottom: 5, lineHeight: 1.3 }}>{s.name}</p>
                <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.55, marginBottom: 8 }}>{s.role}</p>
                <div style={{ display: "inline-block", background: COLORS.greenLight, borderRadius: 6, padding: "3px 8px" }}>
                  <p style={{ fontSize: 11, color: COLORS.greenDark, fontWeight: 700, margin: 0 }}>{s.org}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Abstract
function Abstract() {
  return (
    <section style={{ padding: "5rem 2rem", background: COLORS.white }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <SectionHeader label="Call for Abstracts" title="Submit Your Research Abstract" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
          <div style={{ background: COLORS.bg, borderRadius: 16, padding: "1.5rem", border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.navy, marginBottom: "1rem" }}>Submission Guidelines</h3>
            {[["Max length", "250 words"], ["Structure", "Introduction · Methods · Results · Conclusion"], ["Include", "Title, authors, affiliations, email, WhatsApp"], ["Format", "Word document attachment"], ["Submission", "Email to conference.pharmapool@gmail.com"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.muted, minWidth: 80 }}>{k}</span>
                <span style={{ fontSize: 13, color: COLORS.text }}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ background: COLORS.navy, borderRadius: 16, padding: "1.5rem", color: "#fff", marginBottom: "1rem" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Submit abstracts to:</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.green }}>conference.pharmapool@gmail.com</p>
              <a href="mailto:conference.pharmapool@gmail.com" style={{ display: "inline-block", marginTop: 12, background: COLORS.green, color: COLORS.navyDark, borderRadius: 6, padding: "8px 20px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Send Abstract →</a>
            </div>
            <div style={{ background: COLORS.bg, borderRadius: 12, padding: "1.25rem", border: `1px solid ${COLORS.border}` }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.navy, marginBottom: 8 }}>For enquiries contact:</p>
              <p style={{ fontSize: 13, color: COLORS.text, marginBottom: 4 }}><strong>Prof. Chukwuma O. Agubata</strong> — Chairman, LOC</p>
              <p style={{ fontSize: 13, color: COLORS.green }}>+234 803 824 6065</p>
              <p style={{ fontSize: 13, color: COLORS.text, marginTop: 8, marginBottom: 4 }}><strong>Dr. Onyinyechi L. Nwachukwu</strong> — Secretary, LOC</p>
              <p style={{ fontSize: 13, color: COLORS.green }}>+234 813 841 3948</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact
function Contact() {
  return (
    <section style={{ padding: "4rem 2rem", background: COLORS.bg, flex: 1 }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <SectionHeader label="Contact" title="Get in Touch" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
          {[
            { label: "Email", value: "conference.pharmapool@gmail.com", icon: "📧", link: "mailto:conference.pharmapool@gmail.com" },
            { label: "Registration link", value: "forms.gle/KWyRSzhncUYfRRJt5", icon: "🔗", link: "https://forms.gle/KWyRSzhncUYfRRJt5" },
            { label: "Chairman LOC", value: "+234 803 824 6065", icon: "📞" },
            { label: "Secretary LOC", value: "+234 813 841 3948", icon: "📞" },
          ].map((c, i) => (
            <div key={i} style={{ background: COLORS.white, borderRadius: 12, padding: "1.25rem", border: `1px solid ${COLORS.border}` }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 8, marginBottom: 4 }}>{c.label}</p>
              {c.link
                ? <a href={c.link} style={{ fontSize: 13, color: COLORS.navy, fontWeight: 600, wordBreak: "break-all", textDecoration: "none" }}>{c.value}</a>
                : <p style={{ fontSize: 13, color: COLORS.navy, fontWeight: 600 }}>{c.value}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer
function Footer() {
  return (
    <footer style={{ background: COLORS.navyDark, padding: "3rem 2rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <img src={logo} alt="Pharmapool" style={{ height: 36, width: 36, objectFit: "contain" }} />
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Pharmapool Conference</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7 }}>National Conference &amp; Workshop on Health-Related Research · July 1–2, 2026 · Virtual</p>
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Contact</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 6 }}>conference.pharmapool@gmail.com</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 6 }}>+234 803 824 6065 (Chairman LOC)</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>+234 813 841 3948 (Secretary LOC)</p>
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Partners</p>
            {["GMP Research Group, UNN", "Basic & Translational Cancer Research Group, UNN", "Springer Nature"].map(p => (
              <p key={p} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 6 }}>{p}</p>
            ))}
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textAlign: "center" }}>© 2026 Pharmapool Synergy Solutions Nig. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.navy, marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#E53E3E" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 12, color: "#E53E3E", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

// ── Registration Form
function RegistrationForm() {
  const isMobile = useIsMobile();
  const fileRef = useRef();
  const [step, setStep] = useState("info"); // info | payment | upload | success
  const [form, setForm] = useState({
    surname: "", firstname: "", middlename: "",
    institution: "", department: "", email: "",
    phone: "", isPresenter: "", certificateName: "",
    participationType: "",
  });
  const [errors, setErrors] = useState({});
  const [regData, setRegData] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.surname.trim()) e.surname = "Required";
    if (!form.firstname.trim()) e.firstname = "Required";
    if (!form.institution.trim()) e.institution = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.isPresenter) e.isPresenter = "Required";
    if (!form.certificateName.trim()) e.certificateName = "Required";
    if (!form.participationType) e.participationType = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUploadAndSubmit = async () => {
    if (!proofFile) { setApiError("Please select a file to upload."); return; }
    setUploading(true);
    setApiError("");
    try {
      const fd = new FormData();
      fd.append("registrationId", regData.registrationId);
      fd.append("proof", proofFile);

      const res = await fetch(`${API}/payment/proof`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!data.ok) { setApiError(data.error || "Submission failed"); return; }
      setStep("success");
    } catch {
      setApiError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const inputStyle = (err) => ({
    width: "100%", padding: "10px 12px", fontSize: 14, borderRadius: 8,
    border: `1px solid ${err ? "#E53E3E" : COLORS.border}`, outline: "none",
    fontFamily: "inherit", color: COLORS.text, background: "#fff", boxSizing: "border-box",
  });

  const STEPS = [["info", "1", "Personal Details"], ["payment", "2", "Payment"], ["upload", "3", "Upload Proof"]];

  if (step === "success") {
    return (
      <section style={{ padding: "4rem 2rem", background: COLORS.bg, flex: 1 }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: "3rem 1rem" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: COLORS.greenLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: 32 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: COLORS.navy, marginBottom: 8 }}>Proof Submitted!</h2>
          <p style={{ color: COLORS.muted, fontSize: 15 }}>Thank you, <strong>{form.firstname} {form.surname}</strong>. Your payment proof has been received.</p>
          <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 8 }}>We will review and confirm your registration within <strong>24 hours</strong>. A confirmation will be sent to <strong>{form.email}</strong>.</p>
          <div style={{ marginTop: "1.5rem", background: COLORS.greenLight, borderRadius: 10, padding: "1rem", maxWidth: 400, margin: "1.5rem auto 0" }}>
            <p style={{ fontSize: 13, color: COLORS.greenDark, fontWeight: 600 }}>Next: Submit your abstract</p>
            <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Send to <strong>conference.pharmapool@gmail.com</strong> (max 250 words)</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: "4rem 2rem", background: COLORS.bg }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <SectionHeader label="Registration" title="Register for the Conference" />

        {/* Progress stepper */}
        <div style={{ display: "flex", marginBottom: "2rem", marginTop: "2rem", background: COLORS.white, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
          {STEPS.map(([s, n, label], i, arr) => {
            const idx = STEPS.findIndex(x => x[0] === step);
            const isActive = step === s;
            const isDone = STEPS.findIndex(x => x[0] === s) < idx;
            return (
              <div key={s} style={{ flex: 1, padding: "14px 8px", textAlign: "center", background: isActive ? COLORS.navy : isDone ? COLORS.greenLight : "transparent", borderRight: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? "#fff" : isDone ? COLORS.greenDark : COLORS.muted, display: "block", letterSpacing: 0.5 }}>STEP {n}</span>
                <span style={{ fontSize: isMobile ? 11 : 13, fontWeight: 600, color: isActive ? COLORS.green : isDone ? COLORS.greenDark : COLORS.muted }}>{label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: COLORS.white, borderRadius: 16, padding: isMobile ? "1.25rem" : "2rem", border: `1px solid ${COLORS.border}` }}>

          {/* Step 1: Personal Details */}
          {step === "info" && (
            <>
              <Field label="Participation type" required error={errors.participationType}>
                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
                  {[["nigerian", "🇳🇬 Nigerian (₦30,000)"], ["international", "🌍 International ($50)"]].map(([val, lbl]) => (
                    <label key={val} style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: `1px solid ${form.participationType === val ? COLORS.green : COLORS.border}`, borderRadius: 8, cursor: "pointer", background: form.participationType === val ? COLORS.greenLight : "#fff" }}>
                      <input type="radio" name="participationType" value={val} checked={form.participationType === val} onChange={e => set("participationType", e.target.value)} style={{ accentColor: COLORS.green }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.navy }}>{lbl}</span>
                    </label>
                  ))}
                </div>
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "1rem" }}>
                <Field label="Surname" required error={errors.surname}>
                  <input style={inputStyle(errors.surname)} value={form.surname} onChange={e => set("surname", e.target.value)} placeholder="Okonkwo" />
                </Field>
                <Field label="First name" required error={errors.firstname}>
                  <input style={inputStyle(errors.firstname)} value={form.firstname} onChange={e => set("firstname", e.target.value)} placeholder="Emeka" />
                </Field>
                <Field label="Middle name">
                  <input style={inputStyle(false)} value={form.middlename} onChange={e => set("middlename", e.target.value)} placeholder="Chidi" />
                </Field>
              </div>

              <Field label="Institution / Organization" required error={errors.institution}>
                <input style={inputStyle(errors.institution)} value={form.institution} onChange={e => set("institution", e.target.value)} placeholder="University of Nigeria, Nsukka" />
              </Field>

              <Field label="Department / Unit">
                <input style={inputStyle(false)} value={form.department} onChange={e => set("department", e.target.value)} placeholder="Department of Pharmacology" />
              </Field>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1rem" }}>
                <Field label="Email address" required error={errors.email}>
                  <input type="email" style={inputStyle(errors.email)} value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@institution.edu" />
                </Field>
                <Field label="Telephone / WhatsApp" required error={errors.phone}>
                  <input style={inputStyle(errors.phone)} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+234 800 000 0000" />
                </Field>
              </div>

              <Field label="Are you a presenter?" required error={errors.isPresenter}>
                <div style={{ display: "flex", gap: 12 }}>
                  {["Yes", "No"].map(v => (
                    <label key={v} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", border: `1px solid ${form.isPresenter === v ? COLORS.green : COLORS.border}`, borderRadius: 8, cursor: "pointer", background: form.isPresenter === v ? COLORS.greenLight : "#fff" }}>
                      <input type="radio" name="isPresenter" value={v} checked={form.isPresenter === v} onChange={e => set("isPresenter", e.target.value)} style={{ accentColor: COLORS.green }} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Name as it should appear on certificate" required error={errors.certificateName}>
                <input style={inputStyle(errors.certificateName)} value={form.certificateName} onChange={e => set("certificateName", e.target.value)} placeholder="Dr. Emeka Chidi Okonkwo" />
              </Field>

              <button onClick={async () => {
                if (!validate()) return;
                setApiError("");
                try {
                  const res = await fetch(`${API}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                  });
                  const data = await res.json();
                  if (!data.ok) { setApiError(data.errors?.[0]?.msg || data.error || "Registration failed"); return; }
                  setRegData(data);
                  setStep("payment");
                } catch {
                  setApiError("Network error. Please try again.");
                }
              }} style={{ width: "100%", background: COLORS.navy, color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
                Continue to Payment →
              </button>
              {apiError && <p style={{ color: "#E53E3E", fontSize: 13, marginTop: 10, textAlign: "center" }}>{apiError}</p>}
            </>
          )}

          {/* Step 2: Bank Details */}
          {step === "payment" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>🏦</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, marginBottom: 6 }}>Make Your Payment</h3>
                <p style={{ color: COLORS.muted, fontSize: 14 }}>Transfer the registration fee to the account below</p>
              </div>

              <div style={{ background: COLORS.navy, borderRadius: 14, padding: "1.5rem", marginBottom: "1.25rem" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: "1rem" }}>Bank Account Details</p>
                {[
                  ["Account Name", "Pharmapool Synergy Solutions Nig. Ltd"],
                  ["Bank", "Guaranty Trust Bank (GTB)"],
                  ["Account Number", "0913693242"],
                  ["Amount", form.participationType === "nigerian" ? "₦30,000" : "$50"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{k}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: k === "Amount" ? COLORS.green : "#fff" }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: COLORS.greenLight, borderRadius: 10, padding: "0.875rem 1rem", marginBottom: "1.5rem", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16 }}>ℹ️</span>
                <p style={{ fontSize: 13, color: COLORS.greenDark, lineHeight: 1.6, margin: 0 }}>After making the transfer, click <strong>I've Paid</strong> to upload your proof of payment (screenshot or receipt).</p>
              </div>

              <button onClick={() => setStep("upload")} style={{ width: "100%", background: COLORS.green, color: COLORS.navyDark, border: "none", borderRadius: 8, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                I've Paid — Upload Proof →
              </button>
              <button onClick={() => setStep("info")} style={{ marginTop: 10, background: "none", border: "none", color: COLORS.muted, fontSize: 13, cursor: "pointer", width: "100%" }}>
                ← Back to details
              </button>
            </div>
          )}

          {/* Step 3: Upload Proof */}
          {step === "upload" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>📎</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.navy, marginBottom: 6 }}>Upload Payment Proof</h3>
                <p style={{ color: COLORS.muted, fontSize: 14 }}>Upload a screenshot or photo of your payment receipt</p>
              </div>

              <div onClick={() => fileRef.current.click()}
                style={{ border: `2px dashed ${proofFile ? COLORS.green : COLORS.border}`, borderRadius: 12, padding: "2.5rem 1rem", textAlign: "center", cursor: "pointer", background: proofFile ? COLORS.greenLight : COLORS.bg, marginBottom: "1.25rem", transition: "all 0.2s" }}>
                {proofFile ? (
                  <>
                    <p style={{ fontSize: 32, marginBottom: 8 }}>✅</p>
                    <p style={{ color: COLORS.greenDark, fontWeight: 600, fontSize: 14 }}>{proofFile.name}</p>
                    <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>Click to change file</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 32, marginBottom: 8 }}>📤</p>
                    <p style={{ color: COLORS.navy, fontWeight: 600, fontSize: 14 }}>Click to select file</p>
                    <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>JPG, PNG or PDF · Max 5MB</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }}
                  onChange={e => { setProofFile(e.target.files[0]); setApiError(""); }} />
              </div>

              <div style={{ background: COLORS.bg, borderRadius: 10, padding: "0.875rem 1rem", marginBottom: "1.25rem", fontSize: 13, color: COLORS.muted }}>
                <strong style={{ color: COLORS.navy }}>Review: </strong>
                {form.surname} {form.firstname} · {form.institution} · {form.participationType === "nigerian" ? "₦30,000" : "$50"}
              </div>

              {apiError && <p style={{ color: "#E53E3E", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{apiError}</p>}

              <button onClick={handleUploadAndSubmit} disabled={uploading || !proofFile}
                style={{ width: "100%", background: COLORS.green, color: COLORS.navyDark, border: "none", borderRadius: 8, padding: "14px", fontSize: 15, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading || !proofFile ? 0.7 : 1 }}>
                {uploading ? "Uploading…" : "Submit Registration ✓"}
              </button>
              <button onClick={() => setStep("payment")} style={{ marginTop: 10, background: "none", border: "none", color: COLORS.muted, fontSize: 13, cursor: "pointer", width: "100%" }}>
                ← Back to payment details
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── App
export default function App() {
  const [page, setPage] = useState("home");
  const sectionMap = {
    home: <Hero onNav={setPage} />,
    programme: <Programme />,
    speakers: <Speakers />,
    register: <RegistrationForm />,
    abstract: <Abstract />,
    contact: <Contact />,
  };
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: COLORS.text, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav active={page} onNav={setPage} />
      <div style={{ flex: 1 }}>
        {page === "home"
          ? <>
            <Hero onNav={setPage} />
            <ThemeSection />
            <Programme />
            <Speakers />
            <RegistrationForm />
            <Abstract />
            <Contact />
          </>
          : sectionMap[page]
        }
      </div>
      <Footer />
    </div>
  );
}
