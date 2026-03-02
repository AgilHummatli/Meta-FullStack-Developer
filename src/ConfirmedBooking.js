import React from "react";
import { useLocation, Link } from "react-router-dom";

/**
 * ConfirmedBooking Component
 * Displays confirmation details after successful reservation
 * Shows booking information passed via React Router state
 */
const ConfirmedBooking = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  // Handle case where user navigates directly to /confirmed without booking data
  if (!booking) {
    return (
      <div style={{ 
        padding: "50px 20px", 
        textAlign: "center",
        minHeight: "60vh"
      }}>
        <h1 style={{ color: "#495E57", marginBottom: "20px" }}>
          No Reservation Found
        </h1>
        <p style={{ marginBottom: "30px", color: "#666" }}>
          It looks like you haven't made a reservation yet.
        </p>
        <Link 
          to="/booking" 
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#F4CE14",
            color: "#495E57",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Make a Reservation
        </Link>
      </div>
    );
  }

  // Format date for better readability
  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <main>
      <section style={{ 
        padding: "50px 20px", 
        textAlign: "center",
        minHeight: "60vh"
      }}>
        {/* Success Icon */}
        <div style={{ 
          fontSize: "64px", 
          marginBottom: "20px",
          color: "#495E57"
        }}>
          ✓
        </div>

        {/* Confirmation Heading */}
        <h1 style={{ 
          color: "#495E57", 
          marginBottom: "10px",
          fontSize: "2.5rem"
        }}>
          Booking Confirmed!
        </h1>
        
        <p style={{ 
          color: "#666", 
          marginBottom: "40px",
          fontSize: "1.1rem"
        }}>
          We look forward to serving you at Little Lemon
        </p>

        {/* Reservation Details Card */}
        <div style={{
          maxWidth: "500px",
          margin: "0 auto",
          backgroundColor: "#F8F9FA",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "left"
        }}>
          <h2 style={{ 
            color: "#495E57", 
            marginBottom: "20px",
            fontSize: "1.5rem",
            textAlign: "center"
          }}>
            Reservation Details
          </h2>

          {/* Date */}
          <div style={{ marginBottom: "15px" }}>
            <strong style={{ color: "#495E57" }}>Date:</strong>
            <p style={{ margin: "5px 0 0 0", color: "#333" }}>
              {formatDate(booking.date)}
            </p>
          </div>

          {/* Time */}
          <div style={{ marginBottom: "15px" }}>
            <strong style={{ color: "#495E57" }}>Time:</strong>
            <p style={{ margin: "5px 0 0 0", color: "#333" }}>
              {booking.time}
            </p>
          </div>

          {/* Guests */}
          <div style={{ marginBottom: "15px" }}>
            <strong style={{ color: "#495E57" }}>Number of Guests:</strong>
            <p style={{ margin: "5px 0 0 0", color: "#333" }}>
              {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
            </p>
          </div>

          {/* Occasion */}
          <div style={{ marginBottom: "15px" }}>
            <strong style={{ color: "#495E57" }}>Occasion:</strong>
            <p style={{ margin: "5px 0 0 0", color: "#333" }}>
              {booking.occasion}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div style={{ 
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#FFF4E6",
          borderRadius: "8px",
          maxWidth: "500px",
          margin: "40px auto 0"
        }}>
          <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>
            A confirmation email has been sent to your email address.
            If you need to make changes, please call us at (555) 123-4567.
          </p>
        </div>

        {/* Back to Home Link */}
        <Link 
          to="/" 
          style={{
            display: "inline-block",
            marginTop: "30px",
            padding: "12px 24px",
            backgroundColor: "#495E57",
            color: "#FFFFFF",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
};

export default ConfirmedBooking;
