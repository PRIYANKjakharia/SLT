# Debugging Guide - SLT Dashboard

## 🚀 Quick Start

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test the API:**
   ```bash
   npm run test
   ```

3. **Open the application:**
   - Go to: `http://localhost:3000`
   - Register a new account or login
   - Navigate to the dashboard

## 🔍 Dashboard Loading Issues

### If the dashboard is stuck loading:

1. **Check the browser console:**
   - Press `F12` to open developer tools
   - Go to the "Console" tab
   - Look for any error messages

2. **Common error messages and solutions:**

   **"Network error"**
   - Make sure the server is running (`npm run dev`)
   - Check if the server is on the correct port (3000)

   **"Invalid token"**
   - Clear browser storage: `localStorage.clear()`
   - Log out and log back in

   **"Failed to load user profile"**
   - Check if the database exists
   - Restart the server

3. **Check server logs:**
   - Look at the terminal where you ran `npm run dev`
   - Check for any error messages

## 🧪 Testing API Endpoints

The test script (`npm run test`) checks:
- ✅ Server connectivity
- ✅ User registration
- ✅ User profile endpoint
- ✅ Statistics endpoint
- ✅ Translations endpoint
- ✅ Save translation functionality

## 🗄️ Database Issues

If you have database problems:

1. **Delete and recreate the database:**
   ```bash
   # Stop the server (Ctrl+C)
   rm slt_database.db
   npm run dev
   ```

2. **Check database file:**
   - The database file `slt_database.db` should be created automatically
   - It should be in the root directory of your project

## 🔐 Authentication Issues

1. **Clear authentication data:**
   ```javascript
   // In browser console
   localStorage.clear()
   ```

2. **Check JWT token:**
   ```javascript
   // In browser console
   console.log(localStorage.getItem('authToken'))
   ```

## 🌐 CORS Issues

If you see CORS errors:

1. **Check server configuration:**
   - Make sure CORS is enabled in `server.js`
   - Verify the frontend is being served from the same origin

2. **Check API base URL:**
   - In frontend files, verify `API_BASE = 'http://localhost:3000/api'`

## 📊 Dashboard Data Issues

If dashboard shows no data:

1. **Create some test data:**
   - Use the translator to perform some translations
   - This will populate the database

2. **Check translation history:**
   - Go to the "Recent Translations" tab
   - Should show your translation history

## 🐛 Common Problems

### Problem: Dashboard shows "Loading..." forever
**Solution:** Check browser console for errors, restart server

### Problem: "Access token required" error
**Solution:** Log out and log back in, or clear localStorage

### Problem: "Database error" messages
**Solution:** Delete `slt_database.db` and restart server

### Problem: API endpoints return 404
**Solution:** Make sure server is running and check the port

## 📞 Getting Help

If you're still having issues:

1. **Check the server logs** in your terminal
2. **Check the browser console** for JavaScript errors
3. **Run the test script** to verify API functionality
4. **Verify all files are in the correct locations**

## ✅ Success Indicators

When everything is working correctly, you should see:

- ✅ Server starts without errors
- ✅ API test passes all checks
- ✅ Dashboard loads user data
- ✅ Translation history appears
- ✅ Statistics show correct numbers
- ✅ No error messages in browser console 