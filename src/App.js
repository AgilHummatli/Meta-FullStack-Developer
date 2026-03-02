import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Main from "./Main";
import ConfirmedBooking from "./ConfirmedBooking";
import "./App.css";

/**
 * App Component
 * Root component with routing configuration
 * Sets up navigation between booking form and confirmation page
 */
function App() {
  return (
    <Router>
      <div className="App">
        {/* Header */}
        <header style={{
          backgroundColor: "#495E57",
          padding: "20px",
          color: "#FFFFFF"
        }}>
          <nav style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h1 style={{ margin: 0, fontSize: "1.8rem" }}>
              <Link to="/" style={{ color: "#F4CE14", textDecoration: "none" }}>
                Little Lemon
              </Link>
            </h1>
            <ul style={{
              listStyle: "none",
              display: "flex",
              gap: "30px",
              margin: 0,
              padding: 0
            }}>
              <li>
                <Link to="/" style={{ color: "#FFFFFF", textDecoration: "none" }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/booking" style={{ color: "#FFFFFF", textDecoration: "none" }}>
                  Reservations
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content - Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<Main />} />
          <Route path="/confirmed" element={<ConfirmedBooking />} />
        </Routes>

        {/* Footer */}
        <footer style={{
          backgroundColor: "#495E57",
          color: "#FFFFFF",
          padding: "30px 20px",
          textAlign: "center",
          marginTop: "50px"
        }}>
          <p style={{ margin: 0 }}>
            © 2024 Little Lemon Restaurant. All rights reserved.
          </p>
          <p style={{ margin: "10px 0 0 0", fontSize: "0.9rem", color: "#EDEFEE" }}>
            123 Citrus Lane, Chicago, IL | (555) 123-4567
          </p>
        </footer>
      </div>
    </Router>
  );
}

/**
 * HomePage Component
 * Landing page with call-to-action for reservations
 */
const HomePage = () => {
  return (
    <main>
      <section style={{
        padding: "80px 20px",
        textAlign: "center",
        backgroundColor: "#EDEFEE",
        minHeight: "60vh"
      }}>
        <h1 style={{
          fontSize: "3rem",
          color: "#495E57",
          marginBottom: "20px"
        }}>
          Welcome to Little Lemon
        </h1>
        <p style={{
          fontSize: "1.3rem",
          color: "#333333",
          marginBottom: "40px",
          maxWidth: "600px",
          margin: "0 auto 40px"
        }}>
          Experience authentic Mediterranean cuisine in the heart of Chicago.
          Reserve your table today!
        </p>
        <Link
          to="/booking"
          style={{
            display: "inline-block",
            padding: "15px 40px",
            backgroundColor: "#F4CE14",
            color: "#495E57",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
        >
          Reserve a Table
        </Link>

        {/* Features Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          maxWidth: "1000px",
          margin: "80px auto 0",
          textAlign: "left"
        }}>
          <div style={{
            padding: "20px",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ color: "#495E57", marginBottom: "10px" }}>
              🍋 Fresh Ingredients
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              We source the finest local and Mediterranean ingredients daily.
            </p>
          </div>
          <div style={{
            padding: "20px",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ color: "#495E57", marginBottom: "10px" }}>
              👨‍🍳 Expert Chefs
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Our culinary team brings decades of Mediterranean cooking expertise.
            </p>
          </div>
          <div style={{
            padding: "20px",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ color: "#495E57", marginBottom: "10px" }}>
              🌟 Cozy Atmosphere
            </h3>
            <p style={{ color: "#666", lineHeight: "1.6" }}>
              Perfect setting for intimate dinners and special celebrations.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
