import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Package,
  Wallet,
  ShoppingBag,
  LayoutGrid,
  AlertTriangle,
  X,
  Loader2,
  LogOut,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { supabase } from "./supabaseClient";

// ---------- Paleta Cala Sublim ----------
const COLORS = {
  bg: "#FAF6EF",
  card: "#FFFFFF",
  ink: "#3D2B22",
  inkMuted: "#8A7A6C",
  border: "#E9DECD",
  terracota: "#C1633D",
  terracotaDark: "#A24E30",
  terracotaSoft: "#F1DDCF",
  sage: "#71805E",
  sageSoft: "#E4E9DC",
  rust: "#9C4A3C",
  rustSoft: "#F3DDD7",
  gold: "#B78A3E",
};

const CATEGORIAS_GASTO = ["Insumos", "Envío", "Servicios", "Herramientas", "Otro"];
const CATEGORIAS_PRODUCTO = [
  "Remera clásica",
  "Remera oversize",
  "Buzo canguro",
  "Tote bag",
  "Fibrofácil",
  "Otro",
];
const METODOS_PAGO = ["Efectivo", "Transferencia", "Mercado Pago", "Tarjeta"];
const UNIDADES = ["unidad", "hoja", "metro", "rollo", "pack"];

const fmtARS = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(
    Number(n) || 0
  );
const todayISO = () => new Date().toISOString().slice(0, 10);
const inputStyle = { background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.ink };
const inputClass = "rounded-lg px-3 py-2 text-sm outline-none focus:ring-2";

function StitchDivider() {
  return (
    <svg width="100%" height="10" style={{ display: "block" }}>
      <line x1="0" y1="5" x2="100%" y2="5" stroke={COLORS.terracota} strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function StatCard({ label, value, icon: Icon, tone }) {
  const toneColors = {
    terracota: { bg: COLORS.terracotaSoft, fg: COLORS.terracotaDark },
    sage: { bg: COLORS.sageSoft, fg: COLORS.sage },
    rust: { bg: COLORS.rustSoft, fg: COLORS.rust },
    gold: { bg: "#F3E9D2", fg: COLORS.gold },
  }[tone];
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: COLORS.inkMuted }}>{label}</span>
        <span className="rounded-full p-1.5 flex items-center justify-center" style={{ background: toneColors.bg, color: toneColors.fg }}>
          <Icon size={14} />
        </span>
      </div>
      <span className="text-xl font-semibold" style={{ color: COLORS.ink, fontFamily: "'Fraunces', serif" }}>{value}</span>
    </div>
  );
}

function EmptyState({ text, cta }) {
  return (
    <div className="rounded-2xl p-8 text-center flex flex-col items-center gap-1" style={{ border: `1.5px dashed ${COLORS.border}`, color: COLORS.inkMuted }}>
      <p className="text-sm">{text}</p>
      {cta && <p className="text-xs" style={{ color: COLORS.terracotaDark }}>{cta}</p>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium" style={{ color: COLORS.inkMuted }}>
      {label}
      {children}
    </label>
  );
}

// ---------- Login ----------
function Login() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo("Cuenta creada. Si Supabase pide confirmación, revisá tu mail.");
      }
    } catch (err) {
      setError(err.message || "Algo salió mal.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ background: COLORS.bg, fontFamily: "'Instrument Sans', sans-serif" }}>
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
        <h1 className="text-xl font-semibold text-center mb-1" style={{ color: COLORS.ink, fontFamily: "'Fraunces', serif" }}>Cala Sublim</h1>
        <p className="text-xs text-center mb-2" style={{ color: COLORS.inkMuted }}>
          {mode === "signin" ? "Iniciá sesión para ver tu gestión" : "Creá tu cuenta (solo la primera vez)"}
        </p>
        {error && <div className="text-xs rounded-lg px-3 py-2" style={{ background: COLORS.rustSoft, color: COLORS.rust }}>{error}</div>}
        {info && <div className="text-xs rounded-lg px-3 py-2" style={{ background: COLORS.sageSoft, color: COLORS.sage }}>{info}</div>}
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} style={inputStyle} required />
        </Field>
        <Field label="Contraseña">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} style={inputStyle} required minLength={6} />
        </Field>
        <button disabled={busy} type="submit" className="rounded-lg py-2.5 text-sm font-semibold mt-1" style={{ background: COLORS.terracota, color: "#fff" }}>
          {busy ? "Un momento…" : mode === "signin" ? "Entrar" : "Crear cuenta"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-xs text-center underline"
          style={{ color: COLORS.inkMuted }}
        >
          {mode === "signin" ? "¿Primera vez? Creá tu cuenta" : "¿Ya tenés cuenta? Iniciá sesión"}
        </button>
      </form>
    </div>
  );
}

// ---------- App principal ----------
export default function App() {
  const [session, setSession] = useState(undefined); // undefined = cargando, null = sin sesión

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bg, color: COLORS.inkMuted }}>
        <Loader2 className="animate-spin" size={20} />
      </div>
    );
  }
  if (!session) return <Login />;
  return <Dashboard userId={session.user.id} />;
}

function Dashboard({ userId }) {
  const [tab, setTab] = useState("resumen");
  const [gastos, setGastos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [g, v, s] = await Promise.all([
        supabase.from("gastos").select("*").order("fecha", { ascending: false }),
        supabase.from("ventas").select("*").order("fecha", { ascending: false }),
        supabase.from("stock").select("*").order("created_at", { ascending: false }),
      ]);
      if (g.error || v.error || s.error) throw g.error || v.error || s.error;
      setGastos(g.data || []);
      setVentas(v.data || []);
      setStock(s.data || []);
    } catch (e) {
      setError("No se pudieron cargar los datos: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function addGasto(item) {
    const { data, error } = await supabase.from("gastos").insert({ ...item, user_id: userId }).select();
    if (error) return setError(error.message);
    setGastos([data[0], ...gastos]);
  }
  async function deleteGasto(id) {
    const { error } = await supabase.from("gastos").delete().eq("id", id);
    if (error) return setError(error.message);
    setGastos(gastos.filter((g) => g.id !== id));
  }

  async function addVenta(item) {
    const { data, error } = await supabase.from("ventas").insert({ ...item, user_id: userId }).select();
    if (error) return setError(error.message);
    setVentas([data[0], ...ventas]);
    const match = stock.find((s) => s.producto === item.producto);
    if (match) {
      const nuevaCantidad = Math.max(0, Number(match.cantidad) - Number(item.cantidad));
      const { error: stockErr } = await supabase.from("stock").update({ cantidad: nuevaCantidad }).eq("id", match.id);
      if (!stockErr) setStock(stock.map((s) => (s.id === match.id ? { ...s, cantidad: nuevaCantidad } : s)));
    }
  }
  async function deleteVenta(id) {
    const { error } = await supabase.from("ventas").delete().eq("id", id);
    if (error) return setError(error.message);
    setVentas(ventas.filter((v) => v.id !== id));
  }

  async function addStockItem(item) {
    const { data, error } = await supabase.from("stock").insert({ ...item, user_id: userId }).select();
    if (error) return setError(error.message);
    setStock([data[0], ...stock]);
  }
  async function deleteStockItem(id) {
    const { error } = await supabase.from("stock").delete().eq("id", id);
    if (error) return setError(error.message);
    setStock(stock.filter((s) => s.id !== id));
  }
  async function adjustStock(id, delta) {
    const item = stock.find((s) => s.id === id);
    const nuevaCantidad = Math.max(0, Number(item.cantidad) + delta);
    const { error } = await supabase.from("stock").update({ cantidad: nuevaCantidad }).eq("id", id);
    if (error) return setError(error.message);
    setStock(stock.map((s) => (s.id === id ? { ...s, cantidad: nuevaCantidad } : s)));
  }

  const totalGastos = useMemo(() => gastos.reduce((a, g) => a + Number(g.monto || 0), 0), [gastos]);
  const totalVentas = useMemo(() => ventas.reduce((a, v) => a + Number(v.total || 0), 0), [ventas]);
  const ganancia = totalVentas - totalGastos;
  const stockBajo = useMemo(() => stock.filter((s) => Number(s.cantidad) <= Number(s.minimo || 0)), [stock]);

  const chartData = useMemo(() => {
    const months = {};
    ventas.forEach((v) => {
      const m = (v.fecha || "").slice(0, 7);
      if (!m) return;
      if (!months[m]) months[m] = { mes: m, Ventas: 0, Gastos: 0 };
      months[m].Ventas += Number(v.total || 0);
    });
    gastos.forEach((g) => {
      const m = (g.fecha || "").slice(0, 7);
      if (!m) return;
      if (!months[m]) months[m] = { mes: m, Ventas: 0, Gastos: 0 };
      months[m].Gastos += Number(g.monto || 0);
    });
    return Object.values(months).sort((a, b) => a.mes.localeCompare(b.mes)).slice(-6);
  }, [ventas, gastos]);

  const TABS = [
    { id: "resumen", label: "Resumen", icon: LayoutGrid },
    { id: "ventas", label: "Ventas", icon: ShoppingBag },
    { id: "gastos", label: "Gastos", icon: Wallet },
    { id: "stock", label: "Stock", icon: Package },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center" style={{ background: COLORS.bg, fontFamily: "'Instrument Sans', system-ui, sans-serif" }}>
      <div className="w-full max-w-3xl px-4 pt-6 pb-24">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-semibold leading-tight" style={{ color: COLORS.ink, fontFamily: "'Fraunces', serif" }}>Cala Sublim</h1>
            <p className="text-xs" style={{ color: COLORS.inkMuted }}>Gestión de gastos, ventas y stock</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: COLORS.terracotaSoft, color: COLORS.terracotaDark }} aria-label="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
        <StitchDivider />

        {error && (
          <div className="mt-3 rounded-lg px-3 py-2 text-xs flex items-center gap-2" style={{ background: COLORS.rustSoft, color: COLORS.rust }}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20" style={{ color: COLORS.inkMuted }}>
            <Loader2 className="animate-spin" size={18} /> Cargando tus datos…
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-5">
            {tab === "resumen" && (
              <Resumen totalVentas={totalVentas} totalGastos={totalGastos} ganancia={ganancia} stockBajo={stockBajo} chartData={chartData} ventas={ventas} gastos={gastos} />
            )}
            {tab === "ventas" && <ListaVentas ventas={ventas} onDelete={deleteVenta} />}
            {tab === "gastos" && <ListaGastos gastos={gastos} onDelete={deleteGasto} />}
            {tab === "stock" && <ListaStock stock={stock} onDelete={deleteStockItem} onAdjust={adjustStock} />}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center" style={{ background: `${COLORS.bg}F2`, borderTop: `1px solid ${COLORS.border}`, backdropFilter: "blur(6px)" }}>
        <div className="w-full max-w-3xl px-3 py-2 flex items-center gap-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-colors" style={{ color: active ? COLORS.terracotaDark : COLORS.inkMuted, background: active ? COLORS.terracotaSoft : "transparent" }}>
                <Icon size={18} />
                <span className="text-[11px] font-medium">{t.label}</span>
              </button>
            );
          })}
          <button onClick={() => setShowForm(true)} className="ml-1 rounded-full w-11 h-11 flex items-center justify-center shrink-0" style={{ background: COLORS.terracota, color: "#fff" }} aria-label="Agregar">
            <Plus size={22} />
          </button>
        </div>
      </div>

      {showForm && (
        <FormModal
          initialType={tab === "ventas" ? "venta" : tab === "gastos" ? "gasto" : tab === "stock" ? "stock" : "venta"}
          stock={stock}
          onClose={() => setShowForm(false)}
          onAddGasto={(g) => { addGasto(g); setShowForm(false); }}
          onAddVenta={(v) => { addVenta(v); setShowForm(false); }}
          onAddStock={(s) => { addStockItem(s); setShowForm(false); }}
        />
      )}
    </div>
  );
}

function Resumen({ totalVentas, totalGastos, ganancia, stockBajo, chartData, ventas, gastos }) {
  const recientes = useMemo(() => {
    const marcados = [
      ...ventas.map((v) => ({ ...v, tipo: "venta", monto: v.total })),
      ...gastos.map((g) => ({ ...g, tipo: "gasto", monto: g.monto })),
    ];
    return marcados.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || "")).slice(0, 6);
  }, [ventas, gastos]);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Ventas totales" value={fmtARS(totalVentas)} icon={TrendingUp} tone="sage" />
        <StatCard label="Gastos totales" value={fmtARS(totalGastos)} icon={TrendingDown} tone="rust" />
        <StatCard label="Ganancia" value={fmtARS(ganancia)} icon={Wallet} tone={ganancia >= 0 ? "terracota" : "rust"} />
        <StatCard label="Stock bajo" value={stockBajo.length} icon={Package} tone="gold" />
      </div>

      {stockBajo.length > 0 && (
        <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: COLORS.rustSoft, border: `1px solid ${COLORS.rust}33` }}>
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: COLORS.rust }}>
            <AlertTriangle size={16} /> Se está por acabar
          </div>
          <ul className="text-xs flex flex-col gap-1" style={{ color: COLORS.ink }}>
            {stockBajo.map((s) => (
              <li key={s.id}>{s.producto}: quedan {s.cantidad} {s.unidad} (mínimo {s.minimo})</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>Ventas vs. gastos por mes</h3>
        {chartData.length === 0 ? (
          <EmptyState text="Todavía no hay movimientos para graficar." />
        ) : (
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: COLORS.inkMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: COLORS.inkMuted }} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(v) => fmtARS(v)} contentStyle={{ borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 12 }} />
                <Bar dataKey="Ventas" fill={COLORS.sage} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Gastos" fill={COLORS.rust} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-2xl p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>Movimientos recientes</h3>
        {recientes.length === 0 ? (
          <EmptyState text="Cuando cargues una venta o un gasto, va a aparecer acá." />
        ) : (
          <ul className="flex flex-col gap-2">
            {recientes.map((r) => (
              <li key={r.tipo + r.id} className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span style={{ color: COLORS.ink }}>{r.tipo === "venta" ? r.producto : r.descripcion}</span>
                  <span className="text-xs" style={{ color: COLORS.inkMuted }}>{r.fecha}</span>
                </div>
                <span className="font-semibold" style={{ color: r.tipo === "venta" ? COLORS.sage : COLORS.rust }}>
                  {r.tipo === "venta" ? "+" : "-"}{fmtARS(r.monto)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ListaVentas({ ventas, onDelete }) {
  if (ventas.length === 0) return <EmptyState text="No cargaste ninguna venta todavía." cta="Tocá el + para agregar la primera." />;
  return (
    <ul className="flex flex-col gap-2">
      {ventas.map((v) => (
        <li key={v.id} className="rounded-xl p-3 flex items-center justify-between gap-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium truncate" style={{ color: COLORS.ink }}>{v.producto} × {v.cantidad}</span>
            <span className="text-xs" style={{ color: COLORS.inkMuted }}>{v.fecha} · {v.cliente || "Sin cliente"} · {v.metodo_pago}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-semibold" style={{ color: COLORS.sage }}>{fmtARS(v.total)}</span>
            <button onClick={() => onDelete(v.id)} style={{ color: COLORS.inkMuted }}><Trash2 size={16} /></button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ListaGastos({ gastos, onDelete }) {
  if (gastos.length === 0) return <EmptyState text="No cargaste ningún gasto todavía." cta="Tocá el + para agregar el primero." />;
  return (
    <ul className="flex flex-col gap-2">
      {gastos.map((g) => (
        <li key={g.id} className="rounded-xl p-3 flex items-center justify-between gap-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium truncate" style={{ color: COLORS.ink }}>{g.descripcion}</span>
            <span className="text-xs" style={{ color: COLORS.inkMuted }}>{g.fecha} · {g.categoria}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-semibold" style={{ color: COLORS.rust }}>{fmtARS(g.monto)}</span>
            <button onClick={() => onDelete(g.id)} style={{ color: COLORS.inkMuted }}><Trash2 size={16} /></button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ListaStock({ stock, onDelete, onAdjust }) {
  if (stock.length === 0) return <EmptyState text="Todavía no cargaste stock." cta="Tocá el + para agregar el primer producto." />;
  return (
    <ul className="flex flex-col gap-2">
      {stock.map((s) => {
        const bajo = Number(s.cantidad) <= Number(s.minimo || 0);
        return (
          <li key={s.id} className="rounded-xl p-3 flex items-center justify-between gap-3" style={{ background: COLORS.card, border: `1px solid ${bajo ? COLORS.rust + "55" : COLORS.border}` }}>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium truncate" style={{ color: COLORS.ink }}>{s.producto}</span>
              <span className="text-xs" style={{ color: bajo ? COLORS.rust : COLORS.inkMuted }}>{s.categoria} · mínimo {s.minimo} {s.unidad}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => onAdjust(s.id, -1)} className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.ink }}>−</button>
              <span className="text-sm font-semibold w-10 text-center" style={{ color: COLORS.ink }}>{s.cantidad}</span>
              <button onClick={() => onAdjust(s.id, 1)} className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.ink }}>+</button>
              <button onClick={() => onDelete(s.id)} style={{ color: COLORS.inkMuted }}><Trash2 size={16} /></button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function FormModal({ initialType, stock, onClose, onAddGasto, onAddVenta, onAddStock }) {
  const [type, setType] = useState(initialType);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "#00000055" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto" style={{ background: COLORS.bg }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: COLORS.ink, fontFamily: "'Fraunces', serif" }}>Nuevo registro</h2>
          <button onClick={onClose} style={{ color: COLORS.inkMuted }}><X size={20} /></button>
        </div>
        <div className="flex gap-2 mb-4">
          {[{ id: "venta", label: "Venta" }, { id: "gasto", label: "Gasto" }, { id: "stock", label: "Stock" }].map((t) => (
            <button key={t.id} onClick={() => setType(t.id)} className="flex-1 rounded-lg py-2 text-sm font-medium" style={{ background: type === t.id ? COLORS.terracota : COLORS.card, color: type === t.id ? "#fff" : COLORS.ink, border: `1px solid ${type === t.id ? COLORS.terracota : COLORS.border}` }}>
              {t.label}
            </button>
          ))}
        </div>
        {type === "venta" && <FormVenta stock={stock} onSubmit={onAddVenta} />}
        {type === "gasto" && <FormGasto onSubmit={onAddGasto} />}
        {type === "stock" && <FormStock onSubmit={onAddStock} />}
      </div>
    </div>
  );
}

function FormVenta({ stock, onSubmit }) {
  const [fecha, setFecha] = useState(todayISO());
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [metodoPago, setMetodoPago] = useState(METODOS_PAGO[0]);
  const total = Number(cantidad || 0) * Number(precioUnitario || 0);

  function submit(e) {
    e.preventDefault();
    if (!producto || !precioUnitario) return;
    onSubmit({ fecha, cliente, producto, cantidad: Number(cantidad), precio_unitario: Number(precioUnitario), total, metodo_pago: metodoPago });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <Field label="Fecha"><input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} style={inputStyle} required /></Field>
      <Field label="Producto">
        <input list="productos-list" value={producto} onChange={(e) => setProducto(e.target.value)} placeholder="Ej: Remera oversize estampada" className={inputClass} style={inputStyle} required />
        <datalist id="productos-list">{stock.map((s) => <option key={s.id} value={s.producto} />)}</datalist>
      </Field>
      <Field label="Cliente (opcional)"><input value={cliente} onChange={(e) => setCliente(e.target.value)} className={inputClass} style={inputStyle} placeholder="Nombre del cliente" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Cantidad"><input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className={inputClass} style={inputStyle} required /></Field>
        <Field label="Precio unitario"><input type="number" min="0" value={precioUnitario} onChange={(e) => setPrecioUnitario(e.target.value)} className={inputClass} style={inputStyle} placeholder="$" required /></Field>
      </div>
      <Field label="Método de pago">
        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} className={inputClass} style={inputStyle}>
          {METODOS_PAGO.map((m) => <option key={m}>{m}</option>)}
        </select>
      </Field>
      <div className="flex items-center justify-between text-sm font-semibold mt-1" style={{ color: COLORS.ink }}>
        <span>Total</span><span style={{ color: COLORS.sage }}>{fmtARS(total)}</span>
      </div>
      <button type="submit" className="rounded-lg py-2.5 text-sm font-semibold mt-1" style={{ background: COLORS.terracota, color: "#fff" }}>Guardar venta</button>
    </form>
  );
}

function FormGasto({ onSubmit }) {
  const [fecha, setFecha] = useState(todayISO());
  const [categoria, setCategoria] = useState(CATEGORIAS_GASTO[0]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!descripcion || !monto) return;
    onSubmit({ fecha, categoria, descripcion, monto: Number(monto) });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <Field label="Fecha"><input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} style={inputStyle} required /></Field>
      <Field label="Categoría">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inputClass} style={inputStyle}>
          {CATEGORIAS_GASTO.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Descripción"><input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Rollo de DTF 58cm" className={inputClass} style={inputStyle} required /></Field>
      <Field label="Monto"><input type="number" min="0" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="$" className={inputClass} style={inputStyle} required /></Field>
      <button type="submit" className="rounded-lg py-2.5 text-sm font-semibold mt-1" style={{ background: COLORS.terracota, color: "#fff" }}>Guardar gasto</button>
    </form>
  );
}

function FormStock({ onSubmit }) {
  const [producto, setProducto] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_PRODUCTO[0]);
  const [cantidad, setCantidad] = useState(0);
  const [unidad, setUnidad] = useState(UNIDADES[0]);
  const [minimo, setMinimo] = useState(0);

  function submit(e) {
    e.preventDefault();
    if (!producto) return;
    onSubmit({ producto, categoria, cantidad: Number(cantidad), unidad, minimo: Number(minimo) });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <Field label="Producto"><input value={producto} onChange={(e) => setProducto(e.target.value)} placeholder="Ej: Remera oversize blanca M" className={inputClass} style={inputStyle} required /></Field>
      <Field label="Categoría">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inputClass} style={inputStyle}>
          {CATEGORIAS_PRODUCTO.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Cantidad actual"><input type="number" min="0" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className={inputClass} style={inputStyle} required /></Field>
        <Field label="Unidad">
          <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={inputClass} style={inputStyle}>
            {UNIDADES.map((u) => <option key={u}>{u}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Stock mínimo (para alertarte)"><input type="number" min="0" value={minimo} onChange={(e) => setMinimo(e.target.value)} className={inputClass} style={inputStyle} /></Field>
      <button type="submit" className="rounded-lg py-2.5 text-sm font-semibold mt-1" style={{ background: COLORS.terracota, color: "#fff" }}>Guardar producto</button>
    </form>
  );
}
