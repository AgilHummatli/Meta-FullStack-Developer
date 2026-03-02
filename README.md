# Little Lemon Table Reservation System

**Meta Front-End Developer Professional Certificate - Capstone Project**

A fully functional table booking web application for the Little Lemon restaurant, built with React and modern web development best practices.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Design & Implementation](#design--implementation)
- [Accessibility](#accessibility)
- [Validation & Error Handling](#validation--error-handling)
- [Git Repository](#git-repository)
- [Peer Review Checklist](#peer-review-checklist)
- [Screenshots](#screenshots)
- [License](#license)

---

## 🎯 Project Overview

This capstone project demonstrates proficiency in front-end development by implementing a complete table reservation system. The application allows users to:

- Select a date for their reservation
- Choose from available time slots (dynamically updated)
- Specify the number of guests (1-10)
- Select the occasion (Birthday/Anniversary)
- Receive confirmation of their booking

---

## ✨ Features

### Core Functionality
- ✅ **Dynamic Time Slot Management** - Uses `useReducer` to manage available reservation times
- ✅ **Form Validation** - Client-side validation with meaningful error messages
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Accessible Interface** - WCAG 2.1 compliant with proper ARIA labels and semantic HTML
- ✅ **Confirmation Page** - Displays booking details after successful reservation
- ✅ **Error Handling** - Graceful handling of edge cases and API failures

### User Experience
- Clean, intuitive interface following Little Lemon brand guidelines
- Real-time form validation feedback
- Disabled submit button until required fields are filled
- Success confirmation with detailed booking information
- Easy navigation between pages

---

## 🛠 Tech Stack

- **React** 18.x - UI framework
- **React Router** 6.x - Client-side routing
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **HTML5** - Semantic markup
- **CSS3** - Styling (inline and external)
- **Git** - Version control

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/little-lemon-capstone.git
   cd little-lemon-capstone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   This will install:
   - React and React DOM
   - React Router DOM
   - Testing libraries (Jest, React Testing Library)
   - Other required dependencies

---

## 🚀 Running the Project

### Development Mode

```bash
npm start
```

- Opens the application at `http://localhost:3000`
- Hot-reloading enabled for development
- Default port is 3000 (changes if port is in use)

### Production Build

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Test Suites

The project includes comprehensive tests for:

1. **Component Rendering**
   - Form elements render correctly
   - All labels and inputs are present
   - Confirmation page displays properly

2. **User Interactions**
   - Date selection triggers time updates
   - Form submission works correctly
   - Button states change appropriately

3. **State Management**
   - `initializeTimes` returns correct initial values
   - `updateTimes` reducer handles actions properly
   - State updates trigger re-renders

4. **Validation**
   - Submit button disabled when date is empty
   - Form validates guest count (1-10)
   - Error messages display correctly

5. **Accessibility**
   - ARIA labels are present
   - Form has proper semantic structure
   - All inputs have associated labels

---

## 📁 Project Structure

```
little-lemon-capstone/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js                  # Main app component with routing
│   ├── App.css                 # Global styles
│   ├── App.test.js             # Comprehensive test suite
│   ├── Main.js                 # Booking page with useReducer logic
│   ├── BookingForm.js          # Reservation form component
│   ├── ConfirmedBooking.js     # Confirmation page component
│   ├── index.js                # React entry point
│   └── index.css               # Base CSS
├── package.json                # Project dependencies
├── README.md                   # This file
└── .gitignore                  # Git ignore rules
```

### Component Breakdown

**App.js**
- Root component with React Router setup
- Header navigation and footer
- Route definitions for all pages

**Main.js**
- Container for BookingForm
- Manages available time slots with `useReducer`
- Handles form submission and navigation
- Contains `initializeTimes` and `updateTimes` functions

**BookingForm.js**
- Controlled form component
- Real-time validation
- Accessible form elements with ARIA labels
- Guest count validation (1-10)

**ConfirmedBooking.js**
- Displays reservation confirmation
- Shows formatted booking details
- Handles missing booking data gracefully

---

## 🎨 Design & Implementation

### UX/UI Guidelines Followed

1. **Little Lemon Brand Colors**
   - Primary: `#495E57` (Dark Green)
   - Secondary: `#F4CE14` (Yellow)
   - Accent: `#EE9972` (Peach - for errors)
   - Background: `#EDEFEE` (Light Gray)

2. **Typography**
   - Clean, readable fonts (Segoe UI family)
   - Proper hierarchy with heading sizes
   - Adequate line spacing for readability

3. **Layout**
   - Centered form with max-width for readability
   - Consistent spacing using grid layout
   - Responsive design for all screen sizes

4. **User Flow**
   - Home page → Booking page → Confirmation page
   - Clear navigation in header
   - Breadcrumb-style progress indication

---

## ♿ Accessibility

This project follows WCAG 2.1 Level AA standards:

### Semantic HTML
- Proper use of `<main>`, `<section>`, `<form>`, `<label>`, `<input>` tags
- Heading hierarchy (h1 → h2 → h3)
- Form elements properly associated with labels

### ARIA Labels
- `aria-label="Table reservation form"` on form element
- `aria-label="Submit reservation form"` on submit button
- `aria-required="true"` on required fields
- `aria-invalid` for validation states
- `aria-describedby` linking errors to inputs
- `role="alert"` for error messages

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the form
- Focus indicators visible (outline on focus)

### Screen Reader Support
- Descriptive labels for all form fields
- Error messages announced to screen readers
- Submit button state changes announced

### Color Contrast
- Text meets WCAG AA contrast ratios (4.5:1 minimum)
- Error messages use color + text (not color alone)

---

## ✅ Validation & Error Handling

### Form Validation

1. **Date Field**
   - Required field
   - HTML5 date picker for proper formatting
   - Triggers time slot update on change
   - Error message if empty on submit

2. **Time Field**
   - Dropdown populated with available times
   - Updates dynamically based on selected date
   - Default value provided (17:00)

3. **Guest Count**
   - Number input with min/max constraints
   - HTML5 validation (min="1" max="10")
   - Error message for out-of-range values

4. **Occasion Field**
   - Dropdown with predefined options
   - Default value provided (Birthday)

### Error Messages

- **Clear and Specific**: "Please select a date" instead of "Required field"
- **Visually Distinct**: Red/peach color (#EE9972) with icon
- **Accessible**: Announced to screen readers via `role="alert"`
- **Positioned Well**: Directly below the relevant field

### Edge Cases Handled

1. **Empty Form Submission**
   - Submit button disabled until date is selected
   - Validation prevents submission with invalid data

2. **Invalid Guest Count**
   - HTML5 min/max attributes prevent invalid input
   - Form validation catches any edge cases

3. **Missing Booking Data**
   - Confirmation page shows helpful message if accessed directly
   - Provides link back to booking form

4. **API Failure**
   - Try-catch block handles errors
   - User-friendly error message with contact info
   - Console logging for debugging

5. **Browser Navigation**
   - Confirmation page uses `replace: true` to prevent back button issues
   - Missing data handled gracefully on direct URL access

---

## 🔧 Git Repository

### Commit Strategy

This project follows best practices for Git commits:

- **Meaningful commit messages** describing what changed and why
- **Atomic commits** - each commit represents a single logical change
- **Consistent format**: 
  ```
  feat: Add booking form validation
  fix: Resolve time slot update bug
  docs: Update README with testing instructions
  ```

### Branches

- `main` - Production-ready code
- Feature branches for development (if applicable)

### Example Commit History

```bash
git log --oneline
```

```
a1b2c3d docs: Add comprehensive README and setup instructions
b2c3d4e test: Add unit tests for form validation and submission
c3d4e5f feat: Implement confirmation page with booking details
d4e5f6g feat: Add error handling for edge cases
e5f6g7h feat: Implement booking form with accessibility
f6g7h8i feat: Set up React Router and basic structure
g7h8i9j initial commit: Create React app
```

---

## 📝 Peer Review Checklist

This project addresses all peer review criteria:

### ✅ Design & Implementation
- [x] Follows UX/UI design specifications from earlier course modules
- [x] Implements Little Lemon brand colors and styling
- [x] Clean, professional interface

### ✅ Accessibility
- [x] Semantic HTML throughout the application
- [x] ARIA labels on form and interactive elements
- [x] Proper label associations for all form inputs
- [x] Keyboard navigation support
- [x] Screen reader compatible

### ✅ Testing
- [x] Comprehensive unit tests with Jest
- [x] Component rendering tests
- [x] User interaction tests (fireEvent)
- [x] State management tests (useReducer)
- [x] Validation tests
- [x] All tests pass (`npm test`)

### ✅ Functionality
- [x] Booking form is fully functional
- [x] Form validation works correctly
- [x] Date selection updates available times
- [x] Submit button disabled until form is valid
- [x] Successful submission navigates to confirmation

### ✅ Semantics & Responsiveness
- [x] Semantic HTML5 elements used throughout
- [x] Responsive design works on all screen sizes
- [x] Mobile-friendly layout
- [x] Proper heading hierarchy

### ✅ Version Control
- [x] Project committed to Git repository
- [x] Meaningful commit messages
- [x] Clear commit history
- [x] Hosted on GitHub

### ✅ Code Quality
- [x] Clear, maintainable code structure
- [x] Comprehensive comments explaining logic
- [x] Consistent naming conventions
- [x] Modular component design
- [x] No unnecessary complexity

### ✅ Error Handling
- [x] Edge cases handled appropriately
- [x] Meaningful error messages
- [x] Graceful degradation for missing data
- [x] Try-catch blocks for API calls
- [x] User-friendly error feedback

### ✅ Documentation
- [x] Clear README with project overview
- [x] Detailed installation instructions
- [x] Testing documentation
- [x] Project structure explanation
- [x] Feature descriptions

---

## 📸 Screenshots

*(Add screenshots here when submitting)*

### Home Page
![Home Page](./screenshots/home.png)

### Booking Form
![Booking Form](./screenshots/booking-form.png)

### Confirmation Page
![Confirmation](./screenshots/confirmation.png)

---

## 🎓 Learning Outcomes

This project demonstrates:

- **React Fundamentals**: Components, props, state, hooks
- **Advanced Hooks**: useReducer for complex state management
- **React Router**: Client-side routing and navigation
- **Form Handling**: Controlled components and validation
- **Testing**: Jest and React Testing Library
- **Accessibility**: WCAG compliance and semantic HTML
- **Git**: Version control best practices
- **Documentation**: Clear README and code comments

---

## 📄 License

This project was created as part of the Meta Front-End Developer Professional Certificate program.

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Meta Front-End Developer Professional Certificate program
- Little Lemon restaurant (fictional) for the project context
- Course instructors and peer reviewers

---

## 📞 Support

If you have questions or need clarification:

1. Check the [Issues](https://github.com/yourusername/little-lemon-capstone/issues) page
2. Review course materials on Coursera
3. Contact via the peer review system

---

**Last Updated**: December 2024
