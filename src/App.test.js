import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import BookingForm from "./BookingForm";
import { initializeTimes, updateTimes } from "./Main";
import ConfirmedBooking from "./ConfirmedBooking";

/**
 * Test Suite for Little Lemon Booking System
 * Covers form rendering, validation, state management, and user interactions
 */

// ============================================
// BookingForm Component Tests
// ============================================

describe("BookingForm Component", () => {
  const mockDispatch = jest.fn();
  const mockSubmitForm = jest.fn();
  const mockAvailableTimes = ["17:00", "18:00", "19:00"];

  beforeEach(() => {
    // Clear mock function calls before each test
    mockDispatch.mockClear();
    mockSubmitForm.mockClear();
  });

  test("Renders the BookingForm heading", () => {
    render(
      <BookingForm 
        availableTimes={mockAvailableTimes} 
        dispatch={mockDispatch}
        submitForm={mockSubmitForm}
      />
    );
    const headingElement = screen.getByText("Choose date");
    expect(headingElement).toBeInTheDocument();
  });

  test("Renders all form fields correctly", () => {
    render(
      <BookingForm 
        availableTimes={mockAvailableTimes} 
        dispatch={mockDispatch}
        submitForm={mockSubmitForm}
      />
    );

    // Check all labels are present
    expect(screen.getByText("Choose date")).toBeInTheDocument();
    expect(screen.getByText("Choose time")).toBeInTheDocument();
    expect(screen.getByText("Number of guests")).toBeInTheDocument();
    expect(screen.getByText("Occasion")).toBeInTheDocument();

    // Check all input fields are present
    expect(screen.getByLabelText(/choose date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/choose time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/occasion/i)).toBeInTheDocument();
  });

  test("Submit button is disabled when date is empty", () => {
    render(
      <BookingForm 
        availableTimes={mockAvailableTimes} 
        dispatch={mockDispatch}
        submitForm={mockSubmitForm}
      />
    );
    
    const submitButton = screen.getByDisplayValue("Make Your Reservation");
    expect(submitButton).toBeDisabled();
  });

  test("Submit button is enabled when date is selected", () => {
    render(
      <BookingForm 
        availableTimes={mockAvailableTimes} 
        dispatch={mockDispatch}
        submitForm={mockSubmitForm}
      />
    );
    
    const dateInput = screen.getByLabelText(/choose date/i);
    fireEvent.change(dateInput, { target: { value: "2024-12-25" } });
    
    const submitButton = screen.getByDisplayValue("Make Your Reservation");
    expect(submitButton).not.toBeDisabled();
  });

  test("Dispatches UPDATE_TIMES action when date changes", () => {
    render(
      <BookingForm 
        availableTimes={mockAvailableTimes} 
        dispatch={mockDispatch}
        submitForm={mockSubmitForm}
      />
    );
    
    const dateInput = screen.getByLabelText(/choose date/i);
    fireEvent.change(dateInput, { target: { value: "2024-12-25" } });
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_TIMES",
      payload: "2024-12-25"
    });
  });

  test("Calls submitForm with correct data on form submission", () => {
    render(
      <BookingForm 
        availableTimes={mockAvailableTimes} 
        dispatch={mockDispatch}
        submitForm={mockSubmitForm}
      />
    );
    
    // Fill out the form
    const dateInput = screen.getByLabelText(/choose date/i);
    const timeSelect = screen.getByLabelText(/choose time/i);
    const guestsInput = screen.getByLabelText(/number of guests/i);
    const occasionSelect = screen.getByLabelText(/occasion/i);
    
    fireEvent.change(dateInput, { target: { value: "2024-12-25" } });
    fireEvent.change(timeSelect, { target: { value: "19:00" } });
    fireEvent.change(guestsInput, { target: { value: "4" } });
    fireEvent.change(occasionSelect, { target: { value: "Anniversary" } });
    
    // Submit the form
    const submitButton = screen.getByDisplayValue("Make Your Reservation");
    fireEvent.click(submitButton);
    
    // Verify submitForm was called with correct data
    expect(mockSubmitForm).toHaveBeenCalledWith({
      date: "2024-12-25",
      time: "19:00",
      guests: "4",
      occasion: "Anniversary"
    });
  });

  test("Displays all available time slots in dropdown", () => {
    render(
      <BookingForm 
        availableTimes={mockAvailableTimes} 
        dispatch={mockDispatch}
        submitForm={mockSubmitForm}
      />
    );
    
    const timeSelect = screen.getByLabelText(/choose time/i);
    
    mockAvailableTimes.forEach(time => {
      expect(timeSelect).toContainHTML(`<option value="${time}">${time}</option>`);
    });
  });

  test("Has correct HTML5 validation attributes", () => {
    render(
      <BookingForm 
        availableTimes={mockAvailableTimes} 
        dispatch={mockDispatch}
        submitForm={mockSubmitForm}
      />
    );
    
    const dateInput = screen.getByLabelText(/choose date/i);
    const guestsInput = screen.getByLabelText(/number of guests/i);
    
    expect(dateInput).toHaveAttribute("type", "date");
    expect(dateInput).toHaveAttribute("required");
    expect(guestsInput).toHaveAttribute("min", "1");
    expect(guestsInput).toHaveAttribute("max", "10");
  });
});

// ============================================
// State Management Tests (useReducer)
// ============================================

describe("State Management Functions", () => {
  test("initializeTimes returns the correct initial time slots", () => {
    const expectedValue = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
    expect(initializeTimes()).toEqual(expectedValue);
  });

  test("updateTimes returns new times when UPDATE_TIMES action is dispatched", () => {
    const initialState = ["17:00"];
    const action = { type: "UPDATE_TIMES", payload: "2024-12-25" };
    const expectedValue = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
    
    expect(updateTimes(initialState, action)).toEqual(expectedValue);
  });

  test("updateTimes returns the same state when no valid action is provided", () => {
    const initialState = ["17:00"];
    const action = { type: "INVALID" };
    
    expect(updateTimes(initialState, action)).toEqual(initialState);
  });

  test("updateTimes handles missing action type gracefully", () => {
    const initialState = ["17:00", "18:00"];
    const action = {};
    
    expect(updateTimes(initialState, action)).toEqual(initialState);
  });
});

// ============================================
// ConfirmedBooking Component Tests
// ============================================

describe("ConfirmedBooking Component", () => {
  test("Displays booking details when state is provided", () => {
    const mockBooking = {
      date: "2024-12-25",
      time: "19:00",
      guests: 4,
      occasion: "Anniversary"
    };

    render(
      <BrowserRouter>
        <ConfirmedBooking />
      </BrowserRouter>,
      {
        wrapper: ({ children }) => (
          <BrowserRouter>
            {children}
          </BrowserRouter>
        ),
        initialEntries: [{ pathname: '/confirmed', state: { booking: mockBooking } }]
      }
    );

    // Note: This test needs react-router's MemoryRouter for full testing
    // This is a basic structure - full implementation would use MemoryRouter
  });

  test("Shows appropriate message when no booking data is available", () => {
    render(
      <BrowserRouter>
        <ConfirmedBooking />
      </BrowserRouter>
    );

    expect(screen.getByText("No Reservation Found")).toBeInTheDocument();
  });
});

// ============================================
// Accessibility Tests
// ============================================

describe("Accessibility", () => {
  const mockDispatch = jest.fn();
  const mockSubmitForm = jest.fn();
  const mockAvailableTimes = ["17:00", "18:00", "19:00"];

  test("Form has proper ARIA label", () => {
    render(
      <BookingForm 
        availableTimes={mockAvailableTimes} 
        dispatch={mockDispatch}
        submitForm={mockSubmitForm}
      />
    );
    
    const form = screen.getByLabelText(/table reservation form/i);
    expect(form).toBeInTheDocument();
  });

  test("All form inputs have associated labels", () => {
    render(
      <BookingForm 
        availableTimes={mockAvailableTimes} 
        dispatch={mockDispatch}
        submitForm={mockSubmitForm}
      />
    );
    
    // Check that each input has a matching label
    const dateInput = screen.getByLabelText(/choose date/i);
    const timeInput = screen.getByLabelText(/choose time/i);
    const guestsInput = screen.getByLabelText(/number of guests/i);
    const occasionInput = screen.getByLabelText(/occasion/i);
    
    expect(dateInput).toBeInTheDocument();
    expect(timeInput).toBeInTheDocument();
    expect(guestsInput).toBeInTheDocument();
    expect(occasionInput).toBeInTheDocument();
  });
});
