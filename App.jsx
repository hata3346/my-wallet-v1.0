import { useState, useMemo } from "react";
import {
  LayoutDashboard, ArrowLeftRight, Heart, Target, Settings as SettingsIcon,
  Plus, Search, X, TrendingUp, TrendingDown, Wallet, PiggyBank,
  ShoppingBag, Utensils, Shirt, Gamepad2, Cpu, GraduationCap, Bus,
  HeartPulse, Receipt, Repeat, Clapperboard, Plane, Dumbbell, Home,
  Users, PawPrint, MoreHorizontal, Trash2, Check
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid
} from "recharts";

const THEME_COLORS = [
  { name: "Emerald", value: "#00C853" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Gold", value: "#F59E0B" },
  { name: "Rose", value: "#EF4444" },
  { name: "Teal", value: "#14B8A6" },
];

const CURRENCIES = [
  { code: "USD", label: "US Dollar", symbol: "$", position: "before" },
  { code: "EUR", label: "Euro", symbol: "€", position: "after" },
  { code: "GBP", label: "British Pound", symbol: "£", position: "before" },
  { code: "MAD", label: "Moroccan Dirham", symbol: "DH", position: "after" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥", position: "before" },
  { code: "CAD", label: "Canadian Dollar", symbol: "CA$", position: "before" },
];

const LANGS = {
  en: {
    name: "English",
    nav: { dashboard: "Dashboard", transactions: "Transactions", wishlist: "Wishlist", goals: "Goals", settings: "Settings" },
    financialScore: "Financial score",
    dashboardTitle: "Dashboard",
    dashboardSub: "Here's your financial overview.",
    addTransaction: "Add transaction",
    currentBalance: "Current balance",
    totalIncome: "Total income",
    totalExpenses: "Total expenses",
    savings: "Savings",
    savingRate: "Saving rate",
    incomeVsExpenses: "Income vs expenses",
    expensesByCategory: "Expenses by category",
    spendingTrend: "Spending trend",
    quickStats: "Quick stats",
    biggestPurchase: "Biggest purchase",
    mostUsedCategory: "Most used category",
    numPurchases: "Number of purchases",
    numIncomes: "Number of incomes",
    transactionsTitle: "Transactions",
    searchPlaceholder: "Search transactions...",
    all: "All",
    noTransactions: "No transactions found.",
    wishlistTitle: "Wishlist",
    funded: "funded",
    left: "left",
    goalsTitle: "Savings goals",
    deadline: "Deadline",
    settingsTitle: "Settings",
    appearance: "Appearance",
    theme: "Theme color",
    regional: "Regional",
    currency: "Currency",
    language: "Language",
    expense: "Expense",
    income: "Income",
    title: "Title",
    amount: "Amount",
    category: "Category",
    date: "Date",
    saveTransaction: "Save transaction",
  },
  fr: {
    name: "Français",
    nav: { dashboard: "Tableau de bord", transactions: "Transactions", wishlist: "Liste de souhaits", goals: "Objectifs", settings: "Réglages" },
    financialScore: "Score financier",
    dashboardTitle: "Tableau de bord",
    dashboardSub: "Voici ton aperçu financier.",
    addTransaction: "Ajouter",
    currentBalance: "Solde actuel",
    totalIncome: "Revenus totaux",
    totalExpenses: "Dépenses totales",
    savings: "Épargne",
    savingRate: "Taux d'épargne",
    incomeVsExpenses: "Revenus vs dépenses",
    expensesByCategory: "Dépenses par catégorie",
    spendingTrend: "Tendance des dépenses",
    quickStats: "Statistiques rapides",
    biggestPurchase: "Plus gros achat",
    mostUsedCategory: "Catégorie la plus utilisée",
    numPurchases: "Nombre d'achats",
    numIncomes: "Nombre de revenus",
    transactionsTitle: "Transactions",
    searchPlaceholder: "Rechercher une transaction...",
    all: "Toutes",
    noTransactions: "Aucune transaction trouvée.",
    wishlistTitle: "Liste de souhaits",
    funded: "financé",
    left: "restant",
    goalsTitle: "Objectifs d'épargne",
    deadline: "Échéance",
    settingsTitle: "Réglages",
    appearance: "Apparence",
    theme: "Couleur du thème",
    regional: "Régional",
    currency: "Devise",
    language: "Langue",
    expense: "Dépense",
    income: "Revenu",
    title: "Titre",
    amount: "Montant",
    category: "Catégorie",
    date: "Date",
    saveTransaction: "Enregistrer",
  },
};

const CATEGORY_META = {
  Food: { icon: Utensils, color: "#00C853" },
  Shopping: { icon: ShoppingBag, color: "#3B82F6" },
  Clothes: { icon: Shirt, color: "#8B5CF6" },
  Gaming: { icon: Gamepad2, color: "#F59E0B" },
  Technology: { icon: Cpu, color: "#EF4444" },
  Education: { icon: GraduationCap, color: "#00C853" },
  Transport: { icon: Bus, color: "#3B82F6" },
  Health: { icon: HeartPulse, color: "#EF4444" },
  Bills: { icon: Receipt, color: "#F59E0B" },
  Subscriptions: { icon: Repeat, color: "#8B5CF6" },
  Entertainment: { icon: Clapperboard, color: "#3B82F6" },
  Travel: { icon: Plane, color: "#00C853" },
  Sports: { icon: Dumbbell, color: "#F59E0B" },
  Home: { icon: Home, color: "#8B5CF6" },
  Family: { icon: Users, color: "#EF4444" },
  Pets: { icon: PawPrint, color: "#00C853" },
  Other: { icon: MoreHorizontal, color: "var(--sub)" },
};

const INCOME_CATEGORIES = ["Salary", "Pocket Money", "Gift", "Business", "Freelance", "Scholarship", "Investment", "Other"];
const EXPENSE_CATEGORIES = Object.keys(CATEGORY_META);

const seedTransactions = [
  { id: 1, type: "income", title: "Monthly salary", amount: 3200, category: "Salary", date: "2026-07-01" },
  { id: 2, type: "expense", title: "Grocery run", amount: 84.5, category: "Food", date: "2026-07-03" },
  { id: 3, type: "expense", title: "Spotify + Netflix", amount: 22.98, category: "Subscriptions", date: "2026-07-04" },
  { id: 4, type: "expense", title: "New keyboard", amount: 129, category: "Technology", date: "2026-07-06" },
  { id: 5, type: "income", title: "Logo design gig", amount: 350, category: "Freelance", date: "2026-07-07" },
  { id: 6, type: "expense", title: "Metro pass", amount: 60, category: "Transport", date: "2026-07-08" },
  { id: 7, type: "expense", title: "Dinner out", amount: 46.2, category: "Food", date: "2026-07-10" },
  { id: 8, type: "expense", title: "Gym membership", amount: 35, category: "Sports", date: "2026-07-11" },
  { id: 9, type: "expense", title: "Steam sale", amount: 58, category: "Gaming", date: "2026-07-13" },
  { id: 10, type: "expense", title: "Electricity bill", amount: 74, category: "Bills", date: "2026-07-14" },
  { id: 11, type: "income", title: "Birthday gift", amount: 100, category: "Gift", date: "2026-07-15" },
  { id: 12, type: "expense", title: "Jacket", amount: 89, category: "Clothes", date: "2026-07-16" },
];

const seedWishlist = [
  { id: 1, name: "MacBook Air M4", price: 1299, saved: 640, priority: "High" },
  { id: 2, name: "Standing desk", price: 420, saved: 420, priority: "Medium" },
  { id: 3, name: "Noise-cancelling headphones", price: 249, saved: 90, priority: "Low" },
];

const seedGoals = [
  { id: 1, name: "Emergency fund", target: 5000, saved: 3100, deadline: "2026-12-31" },
  { id: 2, name: "Trip to Japan", target: 2500, saved: 780, deadline: "2027-04-01" },
];

const trendData = [
  { label: "W1", spending: 210 }, { label: "W2", spending: 340 },
  { label: "W3", spending: 180 }, { label: "W4", spending: 400 },
];

const monthlyData = [
  { label: "Feb", income: 3400, expenses: 2100 },
  { label: "Mar", income: 3100, expenses: 2450 },
  { label: "Apr", income: 3600, expenses: 2200 },
  { label: "May", income: 3300, expenses: 2800 },
  { label: "Jun", income: 3550, expenses: 2350 },
  { label: "Jul", income: 3650, expenses: 2000 },
];

const COUNTRY_CURRENCY = {
  US: "USD", GB: "GBP", MA: "MAD", FR: "EUR", DE: "EUR", ES: "EUR", IT: "EUR",
  PT: "EUR", NL: "EUR", BE: "EUR", IE: "EUR", CA: "CAD", JP: "JPY",
};

function detectCurrencyFromLocale() {
  try {
    const locale = (typeof navigator !== "undefined" && navigator.language) || "en-US";
    const region = locale.split("-")[1]?.toUpperCase();
    const code = COUNTRY_CURRENCY[region] || "USD";
    return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
  } catch {
    return CURRENCIES[0];
  }
}

function exportPDF() {
  window.print();
}

function fmt(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[20px] border ${className}`} style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, tone = "primary", icon: Icon, accent, cur }) {
  const toneColor = { primary: accent, danger: "#EF4444", secondary: "#3B82F6", accent: "#8B5CF6" }[tone];
  return (
    <Card className="p-5 flex flex-col gap-3 hover:border-[#3a3a3a] transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: "var(--sub)" }}>{label}</span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${toneColor}1A` }}>
          <Icon size={16} color={toneColor} />
        </div>
      </div>
      <div className="text-2xl font-medium text-white">{cur(value)}</div>
      {sub && <div className="text-xs" style={{ color: "var(--sub)" }}>{sub}</div>}
    </Card>
  );
}

function NavItem({ icon: Icon, label, active, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
      style={{
        background: active ? "var(--card2)" : "transparent",
        color: active ? "#fff" : "var(--sub)",
        border: active ? `1px solid ${accent}40` : "1px solid transparent",
      }}
    >
      <Icon size={17} color={active ? accent : "var(--sub)"} />
      {label}
    </button>
  );
}

function ProgressBar({ value, color = "#00C853" }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--card2)" }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-[22px] border p-6" style={{ background: "var(--card)", borderColor: "var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="text-[var(--sub)] hover:text-white">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function inputStyle() {
  return { background: "var(--card2)", border: "1px solid var(--border)", color: "#fff" };
}

export default function MyWallet() {
  const [tab, setTab] = useState("dashboard");
  const [transactions, setTransactions] = useState(seedTransactions);
  const [wishlist] = useState(seedWishlist);
  const [goals] = useState(seedGoals);
  const [showTxModal, setShowTxModal] = useState(false);
  const [txType, setTxType] = useState("expense");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [accent, setAccent] = useState(THEME_COLORS[0].value);
  const [currency, setCurrency] = useState(() => detectCurrencyFromLocale());
  const [autoCurrency, setAutoCurrency] = useState(true);
  const [langCode, setLangCode] = useState("en");
  const [themeMode, setThemeMode] = useState("dark");
  const t = LANGS[langCode];

  const theme = themeMode === "light"
    ? { bg: "#F5F5F7", card: "#FFFFFF", card2: "#F0F0F1", border: "#E4E4E7", text: "#0A0A0A", sub: "#6B7280" }
    : { bg: "#090909", card: "#141414", card2: "#1B1B1B", border: "#2A2A2A", text: "#FFFFFF", sub: "#A1A1AA" };

  const cssVars = {
    "--bg": theme.bg, "--card": theme.card, "--card2": theme.card2,
    "--border": theme.border, "--text": theme.text, "--sub": theme.sub,
  };

  const cur = (n) => (currency.position === "before" ? `${currency.symbol}${fmt(n)}` : `${fmt(n)} ${currency.symbol}`);

  const [form, setForm] = useState({ title: "", amount: "", category: "Food", date: "2026-07-18" });

  const totalIncome = useMemo(() => transactions.filter(tx => tx.type === "income").reduce((s, tx) => s + tx.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(tx => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0), [transactions]);
  const balance = totalIncome - totalExpenses;
  const savingRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  const categoryBreakdown = useMemo(() => {
    const map = {};
    transactions.filter(tx => tx.type === "expense").forEach(tx => { map[tx.category] = (map[tx.category] || 0) + tx.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value, color: CATEGORY_META[name]?.color || "var(--sub)" }));
  }, [transactions]);

  const biggestPurchase = useMemo(() => {
    const expenses = transactions.filter(tx => tx.type === "expense");
    return expenses.length ? expenses.reduce((a, b) => (a.amount > b.amount ? a : b)) : null;
  }, [transactions]);

  const mostUsedCategory = useMemo(() => {
    const map = {};
    transactions.filter(tx => tx.type === "expense").forEach(tx => { map[tx.category] = (map[tx.category] || 0) + 1; });
    const entries = Object.entries(map);
    return entries.length ? entries.reduce((a, b) => (a[1] > b[1] ? a : b))[0] : "—";
  }, [transactions]);

  const healthScore = useMemo(() => Math.max(0, Math.min(100, Math.round(50 + savingRate))), [savingRate]);

  const filteredTx = useMemo(() => {
    return transactions
      .filter(tx => filterCategory === "All" || tx.category === filterCategory)
      .filter(tx => tx.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filterCategory, search]);

  function addTransaction() {
    if (!form.title || !form.amount) return;
    setTransactions(prev => [
      { id: Date.now(), type: txType, title: form.title, amount: parseFloat(form.amount), category: form.category, date: form.date },
      ...prev,
    ]);
    setForm({ title: "", amount: "", category: "Food", date: "2026-07-18" });
    setShowTxModal(false);
  }

  function removeTx(id) {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }

  return (
    <div className="w-full min-h-screen flex mw-root" style={{ ...cssVars, background: "var(--bg)", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .mw-root .text-white:not(.mw-force-white){ color: var(--text); }
        .mw-print-area { display: none; }
        @media print {
          .mw-app-chrome { display: none !important; }
          .mw-print-area { display: block !important; }
        }
      `}</style>

      <div className="mw-print-area" style={{ background: "#fff", color: "#0A0A0A", padding: 32, fontFamily: "Inter, sans-serif" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 2 }}>My Wallet — Report</h1>
        <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 20 }}>Generated on {new Date().toISOString().slice(0, 10)}</p>

        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          <div><div style={{ fontSize: 11, color: "#6B7280" }}>Balance</div><div style={{ fontSize: 16, fontWeight: 600 }}>{cur(balance)}</div></div>
          <div><div style={{ fontSize: 11, color: "#6B7280" }}>Total income</div><div style={{ fontSize: 16, fontWeight: 600 }}>{cur(totalIncome)}</div></div>
          <div><div style={{ fontSize: 11, color: "#6B7280" }}>Total expenses</div><div style={{ fontSize: 16, fontWeight: 600 }}>{cur(totalExpenses)}</div></div>
          <div><div style={{ fontSize: 11, color: "#6B7280" }}>Saving rate</div><div style={{ fontSize: 16, fontWeight: 600 }}>{savingRate}%</div></div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E4E4E7", textAlign: "left" }}>
              <th style={{ padding: "6px 4px" }}>Date</th>
              <th style={{ padding: "6px 4px" }}>Title</th>
              <th style={{ padding: "6px 4px" }}>Category</th>
              <th style={{ padding: "6px 4px" }}>Type</th>
              <th style={{ padding: "6px 4px", textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).map(tx => (
              <tr key={tx.id} style={{ borderBottom: "1px solid #F0F0F1" }}>
                <td style={{ padding: "6px 4px" }}>{tx.date}</td>
                <td style={{ padding: "6px 4px" }}>{tx.title}</td>
                <td style={{ padding: "6px 4px" }}>{tx.category}</td>
                <td style={{ padding: "6px 4px", textTransform: "capitalize" }}>{tx.type}</td>
                <td style={{ padding: "6px 4px", textAlign: "right", color: tx.type === "income" ? "#00C853" : "#EF4444" }}>
                  {tx.type === "income" ? "+" : "-"}{cur(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-60 shrink-0 border-r p-4 flex flex-col gap-1 mw-app-chrome" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 px-2 py-3 mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${accent}20` }}>
            <Wallet size={16} color={accent} />
          </div>
          <span className="text-white font-medium">My Wallet</span>
        </div>
        <NavItem icon={LayoutDashboard} label={t.nav.dashboard} active={tab === "dashboard"} onClick={() => setTab("dashboard")} accent={accent} />
        <NavItem icon={ArrowLeftRight} label={t.nav.transactions} active={tab === "transactions"} onClick={() => setTab("transactions")} accent={accent} />
        <NavItem icon={Heart} label={t.nav.wishlist} active={tab === "wishlist"} onClick={() => setTab("wishlist")} accent={accent} />
        <NavItem icon={Target} label={t.nav.goals} active={tab === "goals"} onClick={() => setTab("goals")} accent={accent} />
        <NavItem icon={SettingsIcon} label={t.nav.settings} active={tab === "settings"} onClick={() => setTab("settings")} accent={accent} />

        <div className="mt-auto pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <Card className="p-4">
            <div className="text-xs mb-1" style={{ color: "var(--sub)" }}>{t.financialScore}</div>
            <div className="text-2xl font-medium text-white mb-1">{healthScore}<span className="text-sm" style={{ color: "var(--sub)" }}>/100</span></div>
            <ProgressBar value={healthScore} color={healthScore > 70 ? accent : healthScore > 40 ? "#F59E0B" : "#EF4444"} />
          </Card>
        </div>
      </div>

      <div className="flex-1 p-8 max-w-6xl mx-auto w-full mw-app-chrome">
        {tab === "dashboard" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white text-2xl font-medium">{t.dashboardTitle}</h1>
                <p className="text-sm mt-1" style={{ color: "var(--sub)" }}>{t.dashboardSub}</p>
              </div>
              <button onClick={() => setShowTxModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white mw-force-white" style={{ background: accent }}>
                <Plus size={16} /> {t.addTransaction}
              </button>
            </div>

            {totalIncome > 0 && totalExpenses / totalIncome >= 0.8 && (
              <div
                className="px-4 py-3 rounded-xl text-sm flex items-center justify-between"
                style={{
                  background: totalExpenses / totalIncome >= 1 ? "#EF44441A" : "#F59E0B1A",
                  border: `1px solid ${totalExpenses / totalIncome >= 1 ? "#EF4444" : "#F59E0B"}40`,
                  color: totalExpenses / totalIncome >= 1 ? "#EF4444" : "#F59E0B",
                }}
              >
                <span>
                  {totalExpenses / totalIncome >= 1
                    ? "You've spent more than you've earned this month."
                    : `You've used ${Math.round((totalExpenses / totalIncome) * 100)}% of your income this month.`}
                </span>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4">
              <StatCard label={t.currentBalance} value={balance} tone="primary" icon={Wallet} sub={`${t.savingRate}: ${savingRate}%`} accent={accent} cur={cur} />
              <StatCard label={t.totalIncome} value={totalIncome} tone="secondary" icon={TrendingUp} accent={accent} cur={cur} />
              <StatCard label={t.totalExpenses} value={totalExpenses} tone="danger" icon={TrendingDown} accent={accent} cur={cur} />
              <StatCard label={t.savings} value={Math.max(balance, 0)} tone="accent" icon={PiggyBank} accent={accent} cur={cur} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-5 col-span-2">
                <div className="text-sm text-white mb-4 font-medium">{t.incomeVsExpenses}</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="label" stroke="var(--sub)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--sub)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                    <Bar dataKey="income" fill={accent} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5">
                <div className="text-sm text-white mb-4 font-medium">{t.expensesByCategory}</div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                      {categoryBreakdown.map((c, i) => <Cell key={i} fill={c.color} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categoryBreakdown.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--sub)" }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                      {c.name}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-5 col-span-2">
                <div className="text-sm text-white mb-4 font-medium">{t.spendingTrend}</div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="trend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" stroke="var(--sub)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--card2)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12 }} />
                    <Area type="monotone" dataKey="spending" stroke="#3B82F6" fill="url(#trend)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-5 flex flex-col gap-3">
                <div className="text-sm text-white font-medium mb-1">{t.quickStats}</div>
                {[
                  [t.biggestPurchase, biggestPurchase ? `${biggestPurchase.title} · ${cur(biggestPurchase.amount)}` : "—"],
                  [t.mostUsedCategory, mostUsedCategory],
                  [t.numPurchases, transactions.filter(tx => tx.type === "expense").length],
                  [t.numIncomes, transactions.filter(tx => tx.type === "income").length],
                ].map(([label, value], i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--sub)" }}>{label}</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        )}

        {tab === "transactions" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h1 className="text-white text-2xl font-medium">{t.transactionsTitle}</h1>
              <button onClick={() => setShowTxModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white mw-force-white" style={{ background: accent }}>
                <Plus size={16} /> {t.addTransaction}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1" style={inputStyle()}>
                <Search size={15} color="var(--sub)" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="bg-transparent outline-none text-sm w-full text-white placeholder:text-[var(--sub)]"
                />
              </div>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-xl text-sm outline-none" style={inputStyle()}>
                <option>{t.all}</option>
                {[...new Set(transactions.map(tx => tx.category))].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <Card className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filteredTx.map(tx => {
                const meta = CATEGORY_META[tx.category];
                const Icon = meta?.icon || MoreHorizontal;
                return (
                  <div key={tx.id} className="flex items-center justify-between px-5 py-4" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${meta?.color || "var(--sub)"}1A` }}>
                        <Icon size={15} color={meta?.color || "var(--sub)"} />
                      </div>
                      <div>
                        <div className="text-sm text-white">{tx.title}</div>
                        <div className="text-xs" style={{ color: "var(--sub)" }}>{tx.category} · {tx.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium" style={{ color: tx.type === "income" ? accent : "#EF4444" }}>
                        {tx.type === "income" ? "+" : "-"}{cur(tx.amount)}
                      </span>
                      <button onClick={() => removeTx(tx.id)} className="text-[var(--sub)] hover:text-[#EF4444]">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredTx.length === 0 && (
                <div className="px-5 py-10 text-center text-sm" style={{ color: "var(--sub)" }}>{t.noTransactions}</div>
              )}
            </Card>
          </div>
        )}

        {tab === "wishlist" && (
          <div className="flex flex-col gap-5">
            <h1 className="text-white text-2xl font-medium">{t.wishlistTitle}</h1>
            <div className="grid grid-cols-2 gap-4">
              {wishlist.map(item => {
                const pct = Math.round((item.saved / item.price) * 100);
                return (
                  <Card key={item.id} className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{item.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: item.priority === "High" ? "#EF44441A" : item.priority === "Medium" ? "#F59E0B1A" : "#3B82F61A", color: item.priority === "High" ? "#EF4444" : item.priority === "Medium" ? "#F59E0B" : "#3B82F6" }}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg text-white font-medium">{cur(item.saved)}</span>
                      <span className="text-xs" style={{ color: "var(--sub)" }}>/ {cur(item.price)}</span>
                    </div>
                    <ProgressBar value={pct} color={accent} />
                    <div className="flex items-center justify-between text-xs" style={{ color: "var(--sub)" }}>
                      <span>{pct}% {t.funded}</span>
                      <span>{cur(Math.max(item.price - item.saved, 0))} {t.left}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {tab === "goals" && (
          <div className="flex flex-col gap-5">
            <h1 className="text-white text-2xl font-medium">{t.goalsTitle}</h1>
            <div className="grid grid-cols-2 gap-4">
              {goals.map(g => {
                const pct = Math.round((g.saved / g.target) * 100);
                const r = 42;
                const circumference = 2 * Math.PI * r;
                return (
                  <Card key={g.id} className="p-6 flex items-center gap-6">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r={r} fill="none" stroke={accent} strokeWidth="8"
                        strokeDasharray={circumference} strokeDashoffset={circumference - (pct / 100) * circumference}
                        strokeLinecap="round" transform="rotate(-90 50 50)"
                      />
                      <text x="50" y="55" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="500">{pct}%</text>
                    </svg>
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1">{g.name}</div>
                      <div className="text-xs mb-2" style={{ color: "var(--sub)" }}>{t.deadline}: {g.deadline}</div>
                      <div className="text-sm text-white">{cur(g.saved)} <span style={{ color: "var(--sub)" }}>/ {cur(g.target)}</span></div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="flex flex-col gap-6 max-w-md">
            <h1 className="text-white text-2xl font-medium">{t.settingsTitle}</h1>

            <div>
              <div className="text-xs mb-3" style={{ color: "var(--sub)" }}>{t.appearance}</div>
              <Card className="p-5 flex flex-col gap-4">
                <div>
                  <div className="text-sm text-white mb-3">{t.theme}</div>
                  <div className="flex gap-3">
                    {THEME_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setAccent(c.value)}
                        title={c.name}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-transform"
                        style={{ background: c.value, transform: accent === c.value ? "scale(1.1)" : "scale(1)", boxShadow: accent === c.value ? `0 0 0 2px var(--card), 0 0 0 4px ${c.value}` : "none" }}
                      >
                        {accent === c.value && <Check size={16} color="#fff" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white mb-2">Mode</div>
                  <div className="flex gap-2">
                    {[{ id: "dark", label: "Dark" }, { id: "light", label: "Light" }].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setThemeMode(m.id)}
                        className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
                        style={{
                          background: themeMode === m.id ? `${accent}1A` : "var(--card2)",
                          color: themeMode === m.id ? accent : "var(--sub)",
                          border: `1px solid ${themeMode === m.id ? accent : "var(--border)"}`,
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <div className="text-xs mb-3" style={{ color: "var(--sub)" }}>{t.regional}</div>
              <Card className="p-5 flex flex-col gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-white">{t.currency}</div>
                    <button
                      onClick={() => {
                        const next = !autoCurrency;
                        setAutoCurrency(next);
                        if (next) setCurrency(detectCurrencyFromLocale());
                      }}
                      className="text-xs px-2 py-1 rounded-full transition-colors"
                      style={{
                        background: autoCurrency ? `${accent}1A` : "var(--card2)",
                        color: autoCurrency ? accent : "var(--sub)",
                        border: `1px solid ${autoCurrency ? accent : "var(--border)"}`,
                      }}
                    >
                      {autoCurrency ? "Auto (by country)" : "Manual"}
                    </button>
                  </div>
                  <select
                    value={currency.code}
                    disabled={autoCurrency}
                    onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none disabled:opacity-50"
                    style={inputStyle()}
                  >
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} — {c.label} ({c.symbol})</option>)}
                  </select>
                </div>
                <div>
                  <div className="text-sm text-white mb-2">{t.language}</div>
                  <div className="flex gap-2">
                    {Object.entries(LANGS).map(([code, l]) => (
                      <button
                        key={code}
                        onClick={() => setLangCode(code)}
                        className="flex-1 py-2 rounded-xl text-sm font-medium transition-colors"
                        style={{
                          background: langCode === code ? `${accent}1A` : "var(--card2)",
                          color: langCode === code ? accent : "var(--sub)",
                          border: `1px solid ${langCode === code ? accent : "var(--border)"}`,
                        }}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <div className="text-xs mb-3" style={{ color: "var(--sub)" }}>Data</div>
              <Card className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white">Export report</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--sub)" }}>Download a PDF summary of your transactions</div>
                </div>
                <button
                  onClick={exportPDF}
                  className="px-3 py-2 rounded-xl text-sm font-medium mw-force-white"
                  style={{ background: accent, color: "#fff" }}
                >
                  Export PDF
                </button>
              </Card>
            </div>
          </div>
        )}
      </div>

      {showTxModal && (
        <Modal title={t.addTransaction} onClose={() => setShowTxModal(false)}>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setTxType("expense"); setForm(f => ({ ...f, category: "Food" })); }}
              className="flex-1 py-2 rounded-xl text-sm font-medium"
              style={{ background: txType === "expense" ? "#EF44441A" : "var(--card2)", color: txType === "expense" ? "#EF4444" : "var(--sub)", border: "1px solid var(--border)" }}
            >
              {t.expense}
            </button>
            <button
              onClick={() => { setTxType("income"); setForm(f => ({ ...f, category: "Salary" })); }}
              className="flex-1 py-2 rounded-xl text-sm font-medium"
              style={{ background: txType === "income" ? `${accent}1A` : "var(--card2)", color: txType === "income" ? accent : "var(--sub)", border: "1px solid var(--border)" }}
            >
              {t.income}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <input
              placeholder={t.title}
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="px-3 py-2.5 rounded-xl text-sm outline-none placeholder:text-[var(--sub)]"
              style={inputStyle()}
            />
            <input
              placeholder={t.amount}
              type="number"
              value={form.amount}
              onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))}
              className="px-3 py-2.5 rounded-xl text-sm outline-none placeholder:text-[var(--sub)]"
              style={inputStyle()}
            />
            <select
              value={form.category}
              onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              className="px-3 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle()}
            >
              {(txType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))}
              className="px-3 py-2.5 rounded-xl text-sm outline-none"
              style={inputStyle()}
            />
            <button onClick={addTransaction} className="mt-2 py-2.5 rounded-xl text-sm font-medium text-white mw-force-white" style={{ background: accent }}>
              {t.saveTransaction}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
