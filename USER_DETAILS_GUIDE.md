# User Details Dashboard Guide

## 🎯 **Overview**

The User Details Dashboard provides comprehensive information about users who download the HENU OS ISO, including:

- **User Information**: Email, role, subscription status, trial expiry
- **Network Details**: IP addresses (IPv4/IPv6), connection type, timezone
- **Device Information**: Platform, vendor, hardware specs, screen resolution
- **Download History**: Complete download records with timestamps and metadata
- **Analytics Data**: Page views, user engagement, and performance metrics

## 🚀 **Getting Started**

### 1. **Access the Dashboard**
1. Navigate to `/admin` page
2. Sign in with admin credentials (`rsurendrasen90@gmail.com`)
3. Scroll down to the "User Details & Download History" section

### 2. **Initial Setup**
If you see "Users (0)" with no data:
1. Click the **"Create Test Data"** button to populate sample data
2. Click **"Refresh Data"** to load the new data
3. You should now see test users with detailed information

## 📊 **Dashboard Features**

### **Debug Information Panel**
- **Total Users Found**: Shows how many users are in the database
- **Total Downloads**: Shows how many download records exist
- **Filtered Users**: Shows how many users match current filters

### **Search & Filter Options**
- **Search Bar**: Find users by email or UID
- **Role Filter**: Filter by user role (free/premium)
- **Status Filter**: Filter by subscription status (free/premium/trial)

### **User List Panel**
- **User Count**: Shows total number of users
- **User Cards**: Clickable user entries showing:
  - Email address
  - Role and subscription status
  - Download count
  - Last download date
  - Status indicator (green for free, yellow for premium)

### **User Details Panel**
When you select a user, you'll see detailed information in organized sections:

#### **Basic Information**
- Email address
- User role (with crown icon for premium users)
- Subscription status
- Total downloads

#### **Network Information**
- **IP Address**: Current IP address (IPv4 or IPv6)
- **IP Version**: IPv4 or IPv6
- **Connection Type**: Network connection (4g, 5g, etc.)
- **Timezone**: User's timezone

#### **Device Information**
- **Platform**: Operating system (Win32, MacIntel, Linux)
- **Vendor**: Browser vendor (Google Inc., Apple Inc., etc.)
- **Screen Resolution**: Display resolution
- **Language**: Browser language setting

#### **Activity Information**
- **Created Date**: When user first appeared in system
- **Last Download**: Most recent download attempt
- **Email Verified**: Whether email is verified
- **Trial Expiry**: Premium trial expiration date (if applicable)

### **Download History Table**
Shows detailed download records for the selected user:
- **Date**: Download timestamp
- **Mirror**: Download source
- **Size**: File size
- **Time**: Download duration
- **IP Address**: IP used for download
- **Device**: Platform used
- **Network**: Connection type

## 🔧 **Action Buttons**

### **Data Management**
- **Refresh Data**: Reload user data from Firebase
- **Export CSV**: Download user data in CSV format
- **Export JSON**: Download user data in JSON format

### **Testing & Debug**
- **Debug Console**: Log current data to browser console
- **Create Test Data**: Generate sample users and downloads
- **Clear Test Data**: Remove test data (for development)

## 📱 **Sample User Data**

When you create test data, you'll see these sample users:

### **John Doe (Free User)**
- Email: `john.doe@example.com`
- IP: `192.168.1.100` (IPv4)
- Platform: Windows
- Downloads: 2
- Timezone: America/New_York

### **Jane Smith (Premium User)**
- Email: `jane.smith@example.com`
- IP: `10.0.0.50` (IPv4)
- Platform: macOS
- Downloads: 5
- Timezone: Europe/London
- Trial expires in 30 days

### **Bob Wilson (Free User)**
- Email: `bob.wilson@example.com`
- IP: `172.16.0.100` (IPv4)
- Platform: Linux
- Downloads: 1
- Timezone: Asia/Tokyo
- Email not verified

## 🔍 **Troubleshooting**

### **No Users Showing**
1. Check if you're signed in as admin
2. Click "Create Test Data" to populate sample data
3. Click "Refresh Data" to reload
4. Check browser console for error messages

### **Data Not Updating**
1. Ensure Firebase collections exist:
   - `download_attempts`
   - `download_successes`
   - `page_views`
   - `user_engagement`
2. Check browser console for data logs
3. Verify Firebase security rules allow read access

### **IP Addresses Not Showing**
1. IP detection requires internet connection
2. Some IP services may be blocked
3. Check browser console for IP detection errors
4. Fallback will show "unknown" if detection fails

## 📊 **Data Export**

### **CSV Export**
- Includes all user details in spreadsheet format
- Compatible with Excel, Google Sheets, etc.
- Filename: `henu-os-user-data-YYYY-MM-DD.csv`

### **JSON Export**
- Structured data format for analysis
- Includes all metadata and nested objects
- Filename: `henu-os-user-data-YYYY-MM-DD.json`

## 🚨 **Privacy & Security**

### **Data Protection**
- Only authenticated admin users can access dashboard
- User IDs are anonymized in analytics
- IP addresses are collected for security and analytics
- No passwords or sensitive data are stored

### **Data Retention**
- Analytics data is stored indefinitely
- Test data can be cleared using "Clear Test Data" button
- Real user data persists until manually removed

## 🔧 **Customization**

### **Adding New User Fields**
1. Update the `UserDetail` interface in `UserDetailsDashboard.tsx`
2. Modify the data fetching logic in `fetchUserDetails()`
3. Update the user details display components
4. Add new fields to the export functions

### **Modifying Data Collection**
1. Update tracking functions in `src/services/firebase.ts`
2. Modify the `trackDownloadAttempt` and `trackDownloadSuccess` functions
3. Add new analytics events as needed
4. Update Firestore security rules for new collections

## 📞 **Support**

For issues with the User Details Dashboard:

1. **Check Browser Console**: Look for error messages and data logs
2. **Verify Firebase**: Ensure all services are enabled and configured
3. **Test Data**: Use "Create Test Data" to verify functionality
4. **Debug Info**: Use "Debug Console" button to inspect current data
5. **Refresh**: Click "Refresh Data" to reload from Firebase

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: HENU OS Development Team

