import React, { useState } from "react";

/**
 * BookingForm Component
 * Handles table reservation form with validation and accessibility
 * 
 * @param {Array} availableTimes - Array of available time slots
 * @param {Function} dispatch - Reducer dispatch function to update times
 * @param {Function} submitForm - Function to handle form submission
 */
const BookingForm = ({ availableTimes, dispatch, submitForm }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "17:00",
    guests: 1,
    occasion: "Birthday",
  });

  const [errors, setErrors] = useState({});

  /**
   * Handle input changes and trigger time updates for date changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // Update available times when date changes
    if (name === "date") {
      dispatch({ type: "UPDATE_TIMES", payload: value });
    }
  };

  /**
   * Validate form data before submission
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }
    
    if (formData.guests < 1 || formData.guests > 10) {
      newErrors.guests = "Number of guests must be between 1 and 10";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission with validation
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      submitForm(formData);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ display: "grid", maxWidth: "400px", gap: "20px", margin: "0 auto" }} 
      aria-label="Table reservation form"
    >
      {/* Date Selection */}
      <label htmlFor="res-date">Choose date</label>
      <input 
        type="date" 
        id="res-date" 
        name="date" 
        required 
        value={formData.date} 
        onChange={handleChange}
        aria-required="true"
        aria-invalid={errors.date ? "true" : "false"}
        aria-describedby={errors.date ? "date-error" : undefined}
      />
      {errors.date && (
        <p id="date-error" role="alert" style={{ color: "#EE9972", margin: "-10px 0 0 0", fontSize: "14px" }}>
          {errors.date}
        </p>
      )}

      {/* Time Selection */}
      <label htmlFor="res-time">Choose time</label>
      <select 
        id="res-time" 
        name="time" 
        value={formData.time} 
        onChange={handleChange}
        aria-label="Select reservation time"
      >
        {availableTimes.map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>

      {/* Number of Guests */}
      <label htmlFor="guests">Number of guests</label>
      <input 
        type="number" 
        placeholder="1" 
        min="1" 
        max="10" 
        id="guests" 
        name="guests" 
        value={formData.guests} 
        onChange={handleChange}
        aria-required="true"
        aria-invalid={errors.guests ? "true" : "false"}
        aria-describedby={errors.guests ? "guests-error" : undefined}
      />
      {errors.guests && (
        <p id="guests-error" role="alert" style={{ color: "#EE9972", margin: "-10px 0 0 0", fontSize: "14px" }}>
          {errors.guests}
        </p>
      )}

      {/* Occasion Selection */}
      <label htmlFor="occasion">Occasion</label>
      <select 
        id="occasion" 
        name="occasion" 
        value={formData.occasion} 
        onChange={handleChange}
        aria-label="Select occasion"
      >
        <option>Birthday</option>
        <option>Anniversary</option>
      </select>

      {/* Submit Button */}
      <input 
        type="submit" 
        value="Make Your Reservation" 
        aria-label="Submit reservation form"
        disabled={!formData.date}
        style={{
          backgroundColor: !formData.date ? "#ccc" : "#F4CE14",
          color: !formData.date ? "#666" : "#495E57",
          padding: "12px",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: !formData.date ? "not-allowed" : "pointer",
        }}
      />
    </form>
  );
};

export default BookingForm;
