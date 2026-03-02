import React, { useReducer } from "react";
import BookingForm from "./BookingForm";
import { useNavigate } from "react-router-dom";

/**
 * Mock API functions provided by Meta for the Capstone
 * In production, these would be replaced with actual API calls
 */
const fetchAPI = (date) => {
  // Standard mock implementation returns fixed time slots
  return ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
};

const submitAPI = (formData) => {
  // Mock API always returns true for demonstration
  // In production, this would make an actual API call
  return true;
};

/**
 * Reducer to manage available time slots
 * Updates times based on selected date
 * 
 * @param {Array} state - Current array of available times
 * @param {Object} action - Action object with type and payload
 * @returns {Array} Updated array of available times
 */
export const updateTimes = (state, action) => {
  switch (action.type) {
    case "UPDATE_TIMES":
      // Fetch new time slots when date changes
      return fetchAPI(action.payload);
    default:
      // Return current state for unknown actions
      return state;
  }
};

/**
 * Initialize time slots for today's date
 * Called once when component mounts
 * 
 * @returns {Array} Initial array of available times
 */
export const initializeTimes = () => {
  const today = new Date().toISOString().split("T")[0];
  return fetchAPI(today);
};

/**
 * Main Component
 * Handles table reservation page with form and navigation
 */
const Main = () => {
  // useReducer for managing available time slots
  const [availableTimes, dispatch] = useReducer(
    updateTimes, 
    [], 
    initializeTimes
  );
  
  const navigate = useNavigate();

  /**
   * Handle form submission
   * Validates with API and navigates to confirmation page
   * 
   * @param {Object} formData - Reservation details from form
   */
  const submitForm = (formData) => {
    try {
      const result = submitAPI(formData);
      
      if (result) {
        // Navigate to confirmation page with booking data
        navigate("/confirmed", { 
          state: { booking: formData },
          replace: true // Prevent going back to form
        });
      } else {
        // Handle API failure
        alert("Booking failed. Please try again or contact us at (555) 123-4567.");
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Booking error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <main>
      <section style={{ 
        padding: "50px 20px", 
        textAlign: "center",
        minHeight: "60vh"
      }}>
        <h1 style={{ 
          color: "#495E57", 
          marginBottom: "30px",
          fontSize: "2.5rem"
        }}>
          Reserve a Table
        </h1>
        <BookingForm 
          availableTimes={availableTimes} 
          dispatch={dispatch} 
          submitForm={submitForm} 
        />
      </section>
    </main>
  );
};

export default Main;
