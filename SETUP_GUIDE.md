# Quick Setup Guide

## For Peer Reviewers

Follow these steps to run the Little Lemon capstone project locally:

### Step 1: Download the Project

```bash
# Clone the repository (replace with actual GitHub URL)
git clone https://github.com/YOUR_USERNAME/little-lemon-capstone.git
cd little-lemon-capstone
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (React, React Router, testing libraries, etc.)

### Step 3: Run the Application

```bash
npm start
```

- Application will open at `http://localhost:3000`
- Should automatically open in your default browser
- If not, manually navigate to `http://localhost:3000`

### Step 4: Run Tests

```bash
npm test
```

- Press `a` to run all tests
- Tests should all pass (green checkmarks)
- Press `q` to quit test runner

### Step 5: Test the Application

1. **Home Page**
   - Click "Reserve a Table" button

2. **Booking Form**
   - Try submitting without selecting a date (button should be disabled)
   - Select a date (time slots should appear)
   - Select time, number of guests, and occasion
   - Click "Make Your Reservation"

3. **Confirmation Page**
   - Verify booking details are displayed correctly
   - Check that all information matches what you entered

### Expected Behavior

✅ Form validation prevents empty date submission
✅ Time slots update when date changes
✅ All form fields are accessible via keyboard
✅ Error messages appear for invalid inputs
✅ Confirmation page shows complete booking details
✅ All tests pass

### Troubleshooting

**Port 3000 already in use?**
```bash
# The app will prompt to use a different port (like 3001)
# Type 'y' to accept
```

**Dependencies not installing?**
```bash
# Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Tests failing?**
- Make sure you're using Node.js v14 or higher
- Check that all files are present in the project
- Try: `npm install` again

### File Checklist

Make sure these files exist in your download:
- [ ] src/App.js
- [ ] src/Main.js
- [ ] src/BookingForm.js
- [ ] src/ConfirmedBooking.js
- [ ] src/App.test.js
- [ ] src/App.css
- [ ] package.json
- [ ] README.md

---

## For Project Submission

When submitting your own project, ensure:

1. All code is committed to Git
2. Repository is public on GitHub
3. README.md has clear instructions
4. All tests pass
5. Application runs without errors

---

## Contact

If you encounter issues, please:
1. Check the README.md for detailed documentation
2. Review the commit history for context
3. Contact via the peer review system

