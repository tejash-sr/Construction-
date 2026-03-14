# 🧪 Testing Guide

## Quick Test Scenarios

### Scenario 1: First Time User Signup ✅

**Steps:**
1. Open http://localhost:8080
2. You should be redirected to `/login`
3. Click "Sign up" link at the bottom
4. Fill the form:
   - Name: `John Doe`
   - Email: `john.doe@example.com`
   - Password: `SecurePass123`
   - Confirm Password: `SecurePass123`
5. Click "Sign Up" button

**Expected Result:**
- ✅ Loading spinner appears
- ✅ Success toast: "Welcome, John Doe!"
- ✅ Redirected to home page (`/`)
- ✅ Navbar shows "JD" avatar with "John Doe" name
- ✅ Can navigate to all pages

---

### Scenario 2: Sign Up Validation ❌

**Test 2.1: Weak Password**
- Name: `Test User`
- Email: `test@test.com`
- Password: `weak` ❌
- Expected: Error message "Password must be at least 8 characters"

**Test 2.2: Password Missing Uppercase**
- Password: `password123` ❌
- Expected: Error "Password must contain at least one uppercase letter, one lowercase letter, and one number"

**Test 2.3: Password Mismatch**
- Password: `SecurePass123`
- Confirm: `SecurePass456` ❌
- Expected: Error "Passwords don't match"

**Test 2.4: Invalid Email**
- Email: `notanemail` ❌
- Expected: Error "Please enter a valid email"

**Test 2.5: Duplicate Email**
- Use same email as Scenario 1 ❌
- Expected: Error toast "User already exists with this email"

---

### Scenario 3: Login with Existing Account ✅

**Steps:**
1. If logged in, click avatar → "Log out"
2. You'll be on `/login` page
3. Enter credentials:
   - Email: `john.doe@example.com`
   - Password: `SecurePass123`
4. Click "Log In"

**Expected Result:**
- ✅ Loading spinner appears
- ✅ Success toast: "Welcome back, John Doe!"
- ✅ Redirected to home page
- ✅ Navbar shows user info

---

### Scenario 4: Login Validation ❌

**Test 4.1: Wrong Password**
- Email: `john.doe@example.com`
- Password: `WrongPassword123` ❌
- Expected: Error toast "Invalid email or password"

**Test 4.2: Non-existent Email**
- Email: `nobody@example.com` ❌
- Password: `AnyPassword123`
- Expected: Error toast "Invalid email or password"

**Test 4.3: Empty Fields**
- Leave email or password empty ❌
- Expected: Validation errors shown

---

### Scenario 5: Protected Routes 🔒

**Steps:**
1. Logout if logged in
2. Try to visit these URLs directly:
   - http://localhost:8080/
   - http://localhost:8080/about
   - http://localhost:8080/services
   - http://localhost:8080/why-choose-us
   - http://localhost:8080/contact

**Expected Result:**
- ✅ All routes redirect to `/login`
- ✅ Cannot access without authentication

---

### Scenario 6: User Navigation ✅

**Steps:**
1. Login with valid credentials
2. Click each nav link:
   - Home
   - About
   - Services
   - Why Choose Us
   - Contact
3. Try browser back/forward buttons

**Expected Result:**
- ✅ All pages load correctly
- ✅ No redirects to login
- ✅ User info persists in navbar
- ✅ Active link highlighted

---

### Scenario 7: User Profile Dropdown ✅

**Steps:**
1. While logged in, click on your name/avatar in navbar
2. Verify dropdown shows:
   - Your name
   - Your email
   - "Log out" button (red)

**Expected Result:**
- ✅ Dropdown appears
- ✅ User info is correct
- ✅ Clicking outside closes dropdown

---

### Scenario 8: Logout ✅

**Steps:**
1. Click avatar in navbar
2. Click "Log out" button

**Expected Result:**
- ✅ Success toast: "Logged out successfully"
- ✅ Redirected to `/login`
- ✅ Token cleared from localStorage
- ✅ Cannot access protected routes anymore

---

### Scenario 9: Session Persistence ✅

**Steps:**
1. Login with valid credentials
2. Close browser completely
3. Reopen browser
4. Visit http://localhost:8080

**Expected Result:**
- ✅ Still logged in (no redirect to login)
- ✅ Home page loads
- ✅ User info in navbar
- ✅ Token still in localStorage

---

### Scenario 10: Mobile Responsive 📱

**Steps:**
1. Login on desktop
2. Open Chrome DevTools (F12)
3. Click device toolbar icon (Ctrl+Shift+M)
4. Test on different screen sizes:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

**Expected Result:**
- ✅ Hamburger menu on mobile
- ✅ User card in mobile menu
- ✅ Logout button accessible
- ✅ Forms fit on small screens
- ✅ No horizontal scrolling

---

### Scenario 11: Password Visibility Toggle 👁️

**Steps:**
1. Go to signup or login page
2. Click the eye icon in password field

**Expected Result:**
- ✅ Password becomes visible/hidden
- ✅ Icon changes between eye and eye-off

---

### Scenario 12: Browser Back Button After Logout 🔙

**Steps:**
1. Login
2. Navigate to a few pages
3. Logout
4. Press browser back button

**Expected Result:**
- ✅ Still redirected to login (cannot access protected pages)
- ✅ No cached data visible

---

## 🔍 Backend API Testing (Optional)

### Using Browser Console

```javascript
// Test Health Check
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log);

// Test Signup
fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test123@example.com',
    password: 'TestPass123'
  })
})
  .then(r => r.json())
  .then(console.log);

// Test Login
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test123@example.com',
    password: 'TestPass123'
  })
})
  .then(r => r.json())
  .then(data => {
    console.log(data);
    // Save token for next test
    window.testToken = data.data.token;
  });

// Test Protected Route (run after login)
fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${window.testToken}` }
})
  .then(r => r.json())
  .then(console.log);
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution:**
- Verify backend is running: `cd backend && npm run dev`
- Check URL: http://localhost:5000/api/health
- Look for CORS errors in console

### Issue: "User already exists"
**Solution:**
- Use a different email
- Or delete user from MongoDB Atlas

### Issue: "Validation errors not showing"
**Solution:**
- Check browser console for errors
- Ensure React Hook Form is working
- Verify Zod schema is correct

### Issue: "Token expired"
**Solution:**
- Logout and login again
- Token expires after 7 days
- Check JWT_EXPIRE in backend .env

### Issue: "Infinite redirect loop"
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Refresh page
- Check AuthContext logic

---

## ✅ Test Checklist

Copy this to track your testing:

- [ ] Backend starts successfully
- [ ] MongoDB connection works
- [ ] Frontend loads
- [ ] Signup with valid data works
- [ ] Signup validation catches errors
- [ ] Duplicate email rejected
- [ ] Login with valid credentials works
- [ ] Login with wrong password fails
- [ ] Protected routes require auth
- [ ] User name shows in navbar
- [ ] Avatar shows correct initials
- [ ] Dropdown menu works
- [ ] Logout works
- [ ] Session persists after browser close
- [ ] Mobile responsive (hamburger menu)
- [ ] Password toggle works
- [ ] Toast notifications appear
- [ ] Loading states show during requests
- [ ] Browser back button after logout works
- [ ] Can navigate all protected pages

---

## 🎯 Success Metrics

✅ **Functionality**: All features work as expected
✅ **Security**: Passwords hashed, JWT tokens secure
✅ **UX**: Smooth animations, clear error messages
✅ **Performance**: Fast load times, no lag
✅ **Responsive**: Works on all screen sizes
✅ **Accessible**: Keyboard navigation, screen reader friendly

---

**Happy Testing! 🚀**
