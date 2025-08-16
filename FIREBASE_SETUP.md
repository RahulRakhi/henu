# Firebase Authentication Setup Guide

This guide will help you set up Firebase authentication in your React project.

## 🔥 **Step 1: Create Firebase Project**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Click "Create a project"** or "Add project"
3. **Enter project name** (e.g., "your-app-name")
4. **Choose whether to enable Google Analytics** (optional)
5. **Click "Create project"**

## 🔧 **Step 2: Enable Authentication**

1. **In your Firebase project**, go to "Authentication" in the left sidebar
2. **Click "Get started"**
3. **Enable sign-in methods**:
   - **Email/Password**: Enable
   - **Google**: Enable (for Google sign-in)
4. **Click "Save"**

## 📱 **Step 3: Add Your App**

1. **Click the web icon** (</>) on the project overview page
2. **Register your app**:
   - **App nickname**: Your app name
   - **Firebase Hosting**: Check if you want hosting
3. **Click "Register app"**
4. **Copy the Firebase config** (you'll need this)

## 🔑 **Step 4: Update Firebase Config**

Replace the placeholder config in `src/services/firebase.ts` with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyCBR5sd5kI8l-3WpNnL0J16t3SvqGi7lQg",
  authDomain: "henu-586ce.firebaseapp.com",
  databaseURL: "https://henu-586ce-default-rtdb.firebaseio.com",
  projectId: "henu-586ce",
  storageBucket: "henu-586ce.firebasestorage.app",
  messagingSenderId: "633755919625",
  appId: "1:633755919625:web:3a86a50604c1e143495fd8",
  measurementId: "G-GTVCJE7M5T"
};
```

## 🚀 **Step 5: Test Authentication**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Open your app** at http://localhost:5174/

3. **Click "Sign In"** in the navbar

4. **Test the authentication**:
   - Try signing up with email/password
   - Try signing in with Google
   - Try signing out

## ✅ **Features Available**

- ✅ **Email/Password Authentication**
- ✅ **Google Sign-In**
- ✅ **User State Management**
- ✅ **Beautiful Login Modal**
- ✅ **Sign Out Functionality**
- ✅ **User Profile Display**

## 🔒 **Security Rules**

For production, make sure to:

1. **Set up proper Firebase Security Rules**
2. **Configure authorized domains** in Firebase Console
3. **Set up proper CORS settings**

## 🎯 **Usage**

### **Sign In/Sign Up**
- Click the "Sign In" button in the navbar
- Choose between email/password or Google sign-in
- The modal will close automatically after successful authentication

### **User Profile**
- When signed in, you'll see your email in the navbar
- Click "Sign Out" to log out

### **Integration with Chatbot**
- The authentication state is available throughout the app
- You can extend the chatbot to use user information

## 🔧 **Customization**

### **Styling**
- Modify the Login component in `src/components/Login.tsx`
- Update colors, layout, and animations

### **Additional Providers**
- Add more authentication providers (Facebook, Twitter, etc.)
- Update the Firebase service accordingly

### **User Profile**
- Add user profile management
- Store additional user data in Firestore

## 🚨 **Important Notes**

1. **Never commit your Firebase config** to public repositories
2. **Use environment variables** for sensitive data
3. **Set up proper security rules** in Firebase Console
4. **Test authentication thoroughly** before deployment

## 📋 **Environment Variables**

For production, create a `.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update the Firebase config to use these variables.

## 🎉 **You're Ready!**

Your Firebase authentication is now integrated with your React app and Gemini AI chatbot!

**Next steps:**
1. Test the authentication flow
2. Customize the UI as needed
3. Add more features like user profiles
4. Deploy your app

The authentication system is fully functional and ready to use! 🚀 
