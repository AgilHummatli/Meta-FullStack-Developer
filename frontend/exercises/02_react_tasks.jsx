// ============================================================
// META FRONT-END — React Tasks
// Courses: React Basics + Advanced React
// 20 tasks covering: hooks, state, context, custom hooks,
//                    performance, patterns, testing
// ============================================================

import { useState, useEffect, useReducer, useContext,
         useCallback, useMemo, useRef, createContext } from "react";

// ── TASK 01 ─────────────────────────────────────────────────
// Counter with increment, decrement, reset
export function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);
  return (
    <div>
      <button onClick={() => setCount(c => c - 1)}>−</button>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(initial)}>Reset</button>
    </div>
  );
}


// ── TASK 02 ─────────────────────────────────────────────────
// Controlled form with validation
export function SignupForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Invalid email";
    if (form.password.length < 8) e.password = "Min 8 characters";
    return e;
  };

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    console.log("Submitted:", form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      {errors.email && <span style={{color:"red"}}>{errors.email}</span>}
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
      {errors.password && <span style={{color:"red"}}>{errors.password}</span>}
      <button type="submit">Sign Up</button>
    </form>
  );
}


// ── TASK 03 ─────────────────────────────────────────────────
// Fetch data with loading and error states
export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name} — {u.email}</li>)}
    </ul>
  );
}


// ── TASK 04 ─────────────────────────────────────────────────
// useReducer — shopping cart
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      const existing = state.find(i => i.id === action.item.id);
      if (existing)
        return state.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.item, qty: 1 }];
    case "REMOVE":
      return state.filter(i => i.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

export function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <button onClick={() => dispatch({ type: "ADD", item: { id: 1, name: "Book", price: 12.99 } })}>
        Add Book
      </button>
      <ul>
        {cart.map(i => (
          <li key={i.id}>
            {i.name} x{i.qty} — ${(i.price * i.qty).toFixed(2)}
            <button onClick={() => dispatch({ type: "REMOVE", id: i.id })}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={() => dispatch({ type: "CLEAR" })}>Clear cart</button>
    </div>
  );
}


// ── TASK 05 ─────────────────────────────────────────────────
// Context API — theme switcher
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === "light" ? "dark" : "light") }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemedButton() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <button
      onClick={toggle}
      style={{
        background: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
      }}
    >
      Current theme: {theme}
    </button>
  );
}


// ── TASK 06 ─────────────────────────────────────────────────
// Custom hook — useFetch
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Usage:
export function PostList() {
  const { data: posts, loading, error } = useFetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}


// ── TASK 07 ─────────────────────────────────────────────────
// Custom hook — useLocalStorage
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const setStoredValue = newValue => {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}


// ── TASK 08 ─────────────────────────────────────────────────
// Custom hook — useDebounce
export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery) console.log("Searching for:", debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." />;
}


// ── TASK 09 ─────────────────────────────────────────────────
// useMemo + useCallback — expensive list filter
export function FilteredList({ items }) {
  const [filter, setFilter] = useState("");

  const filtered = useMemo(
    () => items.filter(i => i.toLowerCase().includes(filter.toLowerCase())),
    [items, filter]
  );

  const handleChange = useCallback(e => setFilter(e.target.value), []);

  return (
    <div>
      <input value={filter} onChange={handleChange} placeholder="Filter..." />
      <ul>{filtered.map((item, i) => <li key={i}>{item}</li>)}</ul>
    </div>
  );
}


// ── TASK 10 ─────────────────────────────────────────────────
// useRef — click outside to close dropdown
export function Dropdown({ options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)}>Menu ▾</button>
      {open && (
        <ul style={{ position: "absolute", background: "#fff", border: "1px solid #ccc", listStyle: "none", padding: 8 }}>
          {options.map((opt, i) => <li key={i}>{opt}</li>)}
        </ul>
      )}
    </div>
  );
}


// ── TASK 11 ─────────────────────────────────────────────────
// Higher-Order Component — withAuth
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const isLoggedIn = Boolean(localStorage.getItem("token"));
    if (!isLoggedIn) return <p>Please log in to view this page.</p>;
    return <Component {...props} />;
  };
}

function Dashboard() { return <h1>Welcome to your dashboard</h1>; }
export const ProtectedDashboard = withAuth(Dashboard);


// ── TASK 12 ─────────────────────────────────────────────────
// Render props — Mouse tracker
export function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      style={{ width: "100%", height: 200, border: "1px solid #ccc" }}
      onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
    >
      {render(pos)}
    </div>
  );
}
// Usage: <MouseTracker render={({x, y}) => <p>Mouse: {x}, {y}</p>} />


// ── TASK 13 ─────────────────────────────────────────────────
// Compound components — Tabs
const TabContext = createContext();

export function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return <TabContext.Provider value={{ active, setActive }}>{children}</TabContext.Provider>;
}
Tabs.List = function TabList({ children }) {
  return <div style={{ display: "flex", gap: 8 }}>{children}</div>;
};
Tabs.Tab = function Tab({ id, children }) {
  const { active, setActive } = useContext(TabContext);
  return (
    <button
      onClick={() => setActive(id)}
      style={{ fontWeight: active === id ? "bold" : "normal" }}
    >
      {children}
    </button>
  );
};
Tabs.Panel = function Panel({ id, children }) {
  const { active } = useContext(TabContext);
  return active === id ? <div>{children}</div> : null;
};

// Usage:
// <Tabs defaultTab="a">
//   <Tabs.List><Tabs.Tab id="a">Tab A</Tabs.Tab><Tabs.Tab id="b">Tab B</Tabs.Tab></Tabs.List>
//   <Tabs.Panel id="a">Content A</Tabs.Panel>
//   <Tabs.Panel id="b">Content B</Tabs.Panel>
// </Tabs>


// ── TASK 14 ─────────────────────────────────────────────────
// Pagination component
export function usePagination(items, perPage = 5) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / perPage);
  const paginated = items.slice((page - 1) * perPage, page * perPage);
  return { paginated, page, totalPages, setPage };
}

export function PaginatedList({ items }) {
  const { paginated, page, totalPages, setPage } = usePagination(items, 5);
  return (
    <div>
      <ul>{paginated.map((item, i) => <li key={i}>{item}</li>)}</ul>
      <div>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span> Page {page} of {totalPages} </span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}


// ── TASK 15 ─────────────────────────────────────────────────
// Infinite scroll using IntersectionObserver
export function InfiniteList() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) {
        setLoading(true);
        setTimeout(() => {
          setItems(prev => [
            ...prev,
            ...Array.from({ length: 10 }, (_, i) => `Item ${prev.length + i + 1}`)
          ]);
          setLoading(false);
        }, 800);
      }
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]);

  return (
    <ul>
      {items.map((item, i) => <li key={i}>{item}</li>)}
      <li ref={loaderRef}>{loading ? "Loading more..." : ""}</li>
    </ul>
  );
}


// ── TASK 16 ─────────────────────────────────────────────────
// Drag and drop list (no library)
export function DraggableList({ initialItems }) {
  const [items, setItems] = useState(initialItems);
  const dragIndex = useRef(null);

  const onDragStart = i => { dragIndex.current = i; };
  const onDrop = i => {
    const updated = [...items];
    const [dragged] = updated.splice(dragIndex.current, 1);
    updated.splice(i, 0, dragged);
    setItems(updated);
  };

  return (
    <ul>
      {items.map((item, i) => (
        <li
          key={item}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={e => e.preventDefault()}
          onDrop={() => onDrop(i)}
          style={{ padding: 8, border: "1px solid #ccc", margin: 4, cursor: "grab" }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}


// ── TASK 17 ─────────────────────────────────────────────────
// Custom hook — useForm (generic form handler)
export function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e =>
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try { await onSubmit(values); }
    catch (err) { setErrors(err); }
    finally { setSubmitting(false); }
  };

  const reset = () => setValues(initialValues);

  return { values, errors, submitting, handleChange, handleSubmit, reset };
}


// ── TASK 18 ─────────────────────────────────────────────────
// Error Boundary (class component — only way to catch render errors)
import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("Caught error:", error, info);
  }
  render() {
    if (this.state.hasError)
      return <div>Something went wrong: {this.state.error?.message}</div>;
    return this.props.children;
  }
}


// ── TASK 19 ─────────────────────────────────────────────────
// Modal with portal and focus trap
import { createPortal } from "react-dom";

export function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const trap = e => {
      if (e.key === "Tab") {
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return createPortal(
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "grid", placeItems: "center" }}>
      <div ref={modalRef} style={{ background: "#fff", padding: 24, borderRadius: 8, minWidth: 300 }}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}


// ── TASK 20 ─────────────────────────────────────────────────
// Global state with useReducer + Context (mini Redux)
const AppStateContext = createContext();
const AppDispatchContext = createContext();

const initialState = { user: null, notifications: [] };

function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER": return { ...state, user: action.payload };
    case "ADD_NOTIFICATION": return { ...state, notifications: [...state.notifications, action.payload] };
    case "CLEAR_NOTIFICATIONS": return { ...state, notifications: [] };
    case "LOGOUT": return initialState;
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => useContext(AppDispatchContext);
