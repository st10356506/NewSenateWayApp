# Admin Dashboard Setup Guide

## Overview
The admin dashboard allows you to view website analytics and manage guest bookings. Access is protected by Firebase Authentication.

## Setting Up Admin Access

### 1. Create Admin Account in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `senateway-f2c37`
3. Navigate to **Authentication** → **Users**
4. Click **Add user**
5. Enter admin email and password
6. Click **Add user**

### 2. Access the Admin Dashboard

Once you have created an admin account, access the dashboard by:

- **Method 1**: Navigate to `http://localhost:3000/#admin` (development)
- **Method 2**: Navigate to `https://your-domain.com/#admin` (production)
- **Method 3**: Add `?admin=true` as a query parameter

### 3. Login

Use the email and password you created in Firebase Console to sign in.

## Features

### Analytics Dashboard (Shown First)
- **Total Users**: Number of unique visitors
- **Page Views**: Total page views across the site
- **Interactions**: Clicks and form submissions
- **Total Bookings**: Booking requests submitted
- **Reviews**: Guest reviews submitted
- **Engagement Metrics**: Calculated rates and averages

### Bookings Management
- View all booking requests
- Filter by status (All, Pending, Confirmed, Cancelled)
- Confirm or cancel bookings
- Delete bookings
- View detailed booking information

## User Interaction Tracking

The app automatically tracks:
- **Page Views**: Each page navigation
- **Clicks**: Button and link interactions
- **Bookings**: When booking forms are submitted
- **Reviews**: When reviews are submitted

All analytics are stored in Firebase Realtime Database under `/analytics`.

## Security Notes

- Admin authentication is handled by Firebase Auth
- Only users with valid credentials can access the dashboard
- All admin operations are logged in Firebase
- Session is maintained until explicit sign out

## Troubleshooting

### Can't access admin dashboard
- Ensure you've created a user in Firebase Authentication
- Check that you're using the correct email/password
- Verify Firebase Authentication is enabled in your Firebase project

### Analytics not showing data
- Analytics are tracked automatically - check Firebase Realtime Database
- Ensure `analytics` path exists in your database
- Check browser console for any errors

### Bookings not appearing
- Verify bookings are being saved to Firebase under `/bookings`
- Check Firebase Realtime Database rules allow read access

