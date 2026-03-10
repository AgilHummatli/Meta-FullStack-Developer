// ============================================================
// META FULL STACK — Integration Tasks
// Course: The Full Stack
// 20 tasks connecting React frontend to Django REST API
// Covers: API calls, auth flow, state management, deployment
// ============================================================


// ── TASK 01 ─────────────────────────────────────────────────
// Axios client with base config + JWT interceptors
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        const { data } = await axios.post("/api/auth/refresh/", { refresh });
        localStorage.setItem("access_token", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;


// ── TASK 02 ─────────────────────────────────────────────────
// Auth context — login, logout, persist session
import { createContext, useState, useContext, useEffect } from "react";
import api from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api.get("/auth/user/")
        .then(res => setUser(res.data))
        .catch(() => localStorage.clear())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login/", { username, password });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    const me = await api.get("/auth/user/");
    setUser(me.data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);


// ── TASK 03 ─────────────────────────────────────────────────
// Protected route component
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// In router:
// <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />


// ── TASK 04 ─────────────────────────────────────────────────
// Login page that redirects back to original destination
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(creds.username, creds.password);
      navigate(from, { replace: true });
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input name="username" placeholder="Username"
        value={creds.username} onChange={e => setCreds(c => ({ ...c, username: e.target.value }))} />
      <input name="password" type="password" placeholder="Password"
        value={creds.password} onChange={e => setCreds(c => ({ ...c, password: e.target.value }))} />
      <button type="submit">Login</button>
    </form>
  );
}


// ── TASK 05 ─────────────────────────────────────────────────
// Generic useApi hook with pagination support
import { useState, useEffect, useCallback } from "react";
import api from "./api";

export function useApi(endpoint, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoint, { params: { ...params, page } });
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, JSON.stringify(params)]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, page, setPage, refetch: fetchData };
}


// ── TASK 06 ─────────────────────────────────────────────────
// Product listing with filter, search, pagination
import { useState } from "react";
import { useApi } from "./useApi";

export function ProductListing() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { data, loading, error, page, setPage } = useApi("/products/", {
    search, category
  });

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">All categories</option>
        <option value="books">Books</option>
        <option value="electronics">Electronics</option>
      </select>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {data?.results?.map(product => (
          <div key={product.id} style={{ border: "1px solid #eee", padding: 16 }}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.in_stock ? "✅ In stock" : "❌ Out of stock"}</p>
          </div>
        ))}
      </div>

      {data && (
        <div>
          <button disabled={!data.previous} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span>Page {page}</span>
          <button disabled={!data.next} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}


// ── TASK 07 ─────────────────────────────────────────────────
// Shopping cart with optimistic updates + server sync
import { useReducer, useCallback } from "react";
import api from "./api";

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET": return action.items;
    case "ADD": {
      const exists = state.find(i => i.product === action.item.product);
      if (exists) return state.map(i =>
        i.product === action.item.product ? { ...i, quantity: i.quantity + 1 } : i);
      return [...state, action.item];
    }
    case "REMOVE": return state.filter(i => i.id !== action.id);
    default: return state;
  }
};

export function useCart() {
  const [items, dispatch] = useReducer(cartReducer, []);

  const addToCart = useCallback(async product => {
    // Optimistic update
    dispatch({ type: "ADD", item: { product: product.id, quantity: 1, price: product.price, name: product.name } });
    try {
      await api.post("/cart/items/", { product: product.id, quantity: 1 });
    } catch (err) {
      console.error("Failed to sync cart:", err);
    }
  }, []);

  const removeFromCart = useCallback(async id => {
    dispatch({ type: "REMOVE", id });
    await api.delete(`/cart/items/${id}/`);
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, addToCart, removeFromCart, total };
}


// ── TASK 08 ─────────────────────────────────────────────────
// Order creation flow — multi-step form
import { useState } from "react";
import api from "./api";

const STEPS = ["Cart Review", "Shipping", "Payment", "Confirmation"];

export function CheckoutFlow({ cartItems }) {
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState(null);
  const [shipping, setShipping] = useState({ address: "", city: "", zip: "" });

  const placeOrder = async () => {
    const { data } = await api.post("/orders/", {
      items: cartItems.map(i => ({ product: i.product, quantity: i.quantity })),
      shipping_address: `${shipping.address}, ${shipping.city} ${shipping.zip}`,
    });
    setOrder(data);
    setStep(3);
  };

  return (
    <div>
      <nav>
        {STEPS.map((label, i) => (
          <span key={i} style={{ fontWeight: i === step ? "bold" : "normal", margin: "0 8px" }}>
            {label}
          </span>
        ))}
      </nav>

      {step === 0 && (
        <div>
          <ul>{cartItems.map(i => <li key={i.product}>{i.name} x{i.quantity}</li>)}</ul>
          <button onClick={() => setStep(1)}>Continue to Shipping</button>
        </div>
      )}

      {step === 1 && (
        <div>
          <input placeholder="Address" onChange={e => setShipping(s => ({ ...s, address: e.target.value }))} />
          <input placeholder="City" onChange={e => setShipping(s => ({ ...s, city: e.target.value }))} />
          <input placeholder="ZIP" onChange={e => setShipping(s => ({ ...s, zip: e.target.value }))} />
          <button onClick={() => setStep(2)}>Continue to Payment</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p>Payment placeholder (Stripe Elements would go here)</p>
          <button onClick={placeOrder}>Place Order</button>
        </div>
      )}

      {step === 3 && order && (
        <div>
          <h2>✅ Order #{order.id} Confirmed!</h2>
          <p>Total: ${order.total}</p>
        </div>
      )}
    </div>
  );
}


// ── TASK 09 ─────────────────────────────────────────────────
// Real-time notifications with WebSocket
import { useEffect, useState, useRef } from "react";

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}/`);

    ws.current.onmessage = e => {
      const data = JSON.parse(e.data);
      setNotifications(prev => [data, ...prev]);
    };
    ws.current.onerror = err => console.error("WS error:", err);

    return () => ws.current?.close();
  }, [userId]);

  const markRead = id =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, markRead, unreadCount };
}


// ── TASK 10 ─────────────────────────────────────────────────
// Infinite scroll product feed hitting paginated API
import { useState, useEffect, useRef, useCallback } from "react";
import api from "./api";

export function InfiniteProductFeed() {
  const [products, setProducts] = useState([]);
  const [nextUrl, setNextUrl] = useState("/products/");
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (!nextUrl || loading) return;
    setLoading(true);
    const { data } = await api.get(nextUrl);
    setProducts(prev => [...prev, ...data.results]);
    setNextUrl(data.next ? new URL(data.next).pathname + new URL(data.next).search : null);
    setLoading(false);
  }, [nextUrl, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      {products.map(p => (
        <div key={p.id} style={{ padding: 16, borderBottom: "1px solid #eee" }}>
          <strong>{p.name}</strong> — ${p.price}
        </div>
      ))}
      <div ref={loaderRef}>{loading ? "Loading..." : nextUrl ? "Scroll for more" : "End"}</div>
    </div>
  );
}


// ── TASK 11 ─────────────────────────────────────────────────
// File upload with progress to Django API
import { useState } from "react";
import axios from "axios";

export function AvatarUpload() {
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    const form = new FormData();
    form.append("avatar", file);

    axios.post("/api/v1/users/me/avatar/", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: e => setProgress(Math.round(e.loaded / e.total * 100)),
    }).then(() => setProgress(100));
  };

  return (
    <div>
      {preview && <img src={preview} alt="preview" style={{ width: 80, borderRadius: "50%" }} />}
      <input type="file" accept="image/*" onChange={handleFile} />
      {progress > 0 && progress < 100 && (
        <div style={{ width: 200, background: "#eee" }}>
          <div style={{ width: `${progress}%`, background: "#4caf50", height: 8 }} />
        </div>
      )}
    </div>
  );
}


// ── TASK 12 ─────────────────────────────────────────────────
// React Query style — data fetching with cache invalidation
import { useState, useEffect, useRef } from "react";
import api from "./api";

const queryCache = new Map();

export function useQuery(key, fetcher, { staleTime = 30000 } = {}) {
  const [state, setState] = useState(
    () => queryCache.get(key) || { data: null, loading: true, error: null }
  );

  useEffect(() => {
    const cached = queryCache.get(key);
    if (cached?.timestamp && Date.now() - cached.timestamp < staleTime) {
      setState(cached);
      return;
    }
    setState(s => ({ ...s, loading: true }));
    fetcher()
      .then(data => {
        const entry = { data, loading: false, error: null, timestamp: Date.now() };
        queryCache.set(key, entry);
        setState(entry);
      })
      .catch(error => setState({ data: null, loading: false, error }));
  }, [key]);

  const invalidate = () => { queryCache.delete(key); };
  return { ...state, invalidate };
}

// Usage:
// const { data: products, loading } = useQuery("products", () => api.get("/products/").then(r => r.data));


// ── TASK 13 ─────────────────────────────────────────────────
// Form with server-side validation errors mapped to fields
import { useState } from "react";
import api from "./api";

export function ProductForm({ onSuccess }) {
  const [values, setValues] = useState({ name: "", price: "", stock: "", category_id: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
    setFieldErrors(e => ({ ...e, [name]: undefined })); // clear on type
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/products/", values);
      onSuccess?.(data);
    } catch (err) {
      if (err.response?.status === 400) {
        setFieldErrors(err.response.data); // DRF returns {field: [errors]}
      }
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, type = "text") => (
    <div>
      <input name={name} type={type} value={values[name]} onChange={handleChange} placeholder={name} />
      {fieldErrors[name] && <span style={{ color: "red" }}>{fieldErrors[name][0]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {field("name")}
      {field("price", "number")}
      {field("stock", "number")}
      <button disabled={submitting}>{submitting ? "Saving..." : "Create Product"}</button>
    </form>
  );
}


// ── TASK 14 ─────────────────────────────────────────────────
// Optimistic UI — like button
import { useState } from "react";
import api from "./api";

export function LikeButton({ postId, initialLikes, initialLiked }) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  const toggle = async () => {
    // Optimistic update
    setLiked(l => !l);
    setLikes(c => liked ? c - 1 : c + 1);
    try {
      if (liked) {
        await api.delete(`/posts/${postId}/like/`);
      } else {
        await api.post(`/posts/${postId}/like/`);
      }
    } catch {
      // Rollback on failure
      setLiked(l => !l);
      setLikes(c => liked ? c + 1 : c - 1);
    }
  };

  return (
    <button onClick={toggle} style={{ color: liked ? "red" : "gray" }}>
      {liked ? "❤️" : "🤍"} {likes}
    </button>
  );
}


// ── TASK 15 ─────────────────────────────────────────────────
// React Router v6 — full app routing structure
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/login">Login</Link>
      </nav>
      <main><Outlet /></main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductListing />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="orders" element={
              <ProtectedRoute><OrderList /></ProtectedRoute>
            } />
            <Route path="orders/:id" element={
              <ProtectedRoute><OrderDetail /></ProtectedRoute>
            } />
            <Route path="*" element={<h2>404 — Not Found</h2>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


// ── TASK 16 ─────────────────────────────────────────────────
// Environment config + CORS setup reference
/*
  .env.development
  ─────────────────
  REACT_APP_API_URL=http://localhost:8000/api/v1

  .env.production
  ─────────────────
  REACT_APP_API_URL=https://api.yourdomain.com/api/v1

  Django settings.py (CORS)
  ─────────────────────────
  INSTALLED_APPS += ["corsheaders"]
  MIDDLEWARE = ["corsheaders.middleware.CorsMiddleware", ...rest]

  CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://yourdomain.com",
  ]
  CORS_ALLOW_CREDENTIALS = True
*/


// ── TASK 17 ─────────────────────────────────────────────────
// Custom hook — useOrderStatus with polling
import { useState, useEffect, useRef } from "react";
import api from "./api";

export function useOrderStatus(orderId, intervalMs = 5000) {
  const [status, setStatus] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const poll = async () => {
      const { data } = await api.get(`/orders/${orderId}/`);
      setStatus(data.status);
      if (["delivered", "cancelled"].includes(data.status)) {
        clearInterval(intervalRef.current);
      }
    };
    poll();
    intervalRef.current = setInterval(poll, intervalMs);
    return () => clearInterval(intervalRef.current);
  }, [orderId, intervalMs]);

  return status;
}

export function OrderTracker({ orderId }) {
  const status = useOrderStatus(orderId);
  const stages = ["pending", "confirmed", "shipped", "delivered"];
  const current = stages.indexOf(status);

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {stages.map((stage, i) => (
        <div key={stage} style={{
          padding: "4px 12px",
          borderRadius: 20,
          background: i <= current ? "#4caf50" : "#eee",
          color: i <= current ? "white" : "#666",
        }}>
          {stage}
        </div>
      ))}
    </div>
  );
}


// ── TASK 18 ─────────────────────────────────────────────────
// Global toast notification system
import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{ position: "fixed", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: "12px 20px",
            borderRadius: 8,
            background: t.type === "error" ? "#f44336" : t.type === "success" ? "#4caf50" : "#333",
            color: "white",
            minWidth: 200,
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

// Usage: const toast = useToast(); toast("Product added!", "success");


// ── TASK 19 ─────────────────────────────────────────────────
// Dockerfile + docker-compose for full stack deployment
/*
  # Frontend Dockerfile
  FROM node:20-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=build /app/build /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf

  # Backend Dockerfile
  FROM python:3.12-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY . .
  RUN python manage.py collectstatic --noinput
  CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]

  # docker-compose.yml
  version: "3.9"
  services:
    db:
      image: postgres:16
      environment: { POSTGRES_DB: mydb, POSTGRES_USER: user, POSTGRES_PASSWORD: pass }
    backend:
      build: ./backend
      depends_on: [db]
      environment: { DATABASE_URL: postgres://user:pass@db:5432/mydb }
    frontend:
      build: ./frontend
      ports: ["80:80"]
      depends_on: [backend]
*/


// ── TASK 20 ─────────────────────────────────────────────────
// End-to-end: full product page with add to cart + toast feedback
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { useCart } from "./useCart";
import { useQuery } from "./useQuery";
import api from "./api";

export function ProductDetailPage({ productId }) {
  const { user } = useAuth();
  const toast = useToast();
  const { addToCart } = useCart();
  const { data: product, loading } = useQuery(
    `product-${productId}`,
    () => api.get(`/products/${productId}/`).then(r => r.data)
  );

  const handleAddToCart = async () => {
    if (!user) { toast("Please log in to add items to cart", "error"); return; }
    if (!product.in_stock) { toast("This product is out of stock", "error"); return; }
    try {
      await addToCart(product);
      toast(`${product.name} added to cart!`, "success");
    } catch {
      toast("Failed to add to cart. Try again.", "error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>{product.name}</h1>
      <p style={{ fontSize: 24, fontWeight: "bold" }}>${product.price}</p>
      <p>{product.description}</p>
      <p>Category: {product.category?.name}</p>
      <p>{product.in_stock ? `✅ ${product.stock} in stock` : "❌ Out of stock"}</p>
      <button
        onClick={handleAddToCart}
        disabled={!product.in_stock}
        style={{ padding: "12px 24px", background: "#333", color: "#fff", border: "none", borderRadius: 8, cursor: product.in_stock ? "pointer" : "not-allowed" }}
      >
        Add to Cart
      </button>
    </div>
  );
}
