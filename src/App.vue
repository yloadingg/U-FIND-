<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}

import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Match backend port
const userId = JSON.parse(localStorage.getItem('user'))?.id;

if (userId) {
  socket.emit('userOnline', userId);
}

</script>

<style>
/* Overall app background */
body.dark {
  background-color: #1e1e1e;
}

body.dark .sidebar {
  background-color: #1e1e1e;
}

/* Optional: background for cards or sections */
body.dark .card,
body.dark .section,
body.dark .main-content {
  background-color: #2a2a2a;
}

/* --- Dark Mode Styles --- */

/* Header Title */
body.dark .header-title {
  color: #ffffff; /* White text for dark mode */
}

/* Sidebar Navigation Links */
body.dark .sidebar-nav .sidebar-link {
  color: #e0e0e0; /* Lighter grey for dark mode sidebar links */
}

body.dark .sidebar-nav .sidebar-link:hover {
  background-color: #f13131; /* Keep the hover color consistent or adjust as needed */
  color: #ffffff;
}

body.dark .sidebar-logo-title {
  color: #ffffff; /* White text for dark mode sidebar logo title */
}

body.dark .sidebar-profile .profile-name {
  color: #e0e0e0; /* Lighter grey for dark mode profile name */
}

body.dark .sidebar-link.sidebar-link-active {
  background-color: #f13131; /* Keep active link color consistent */
  color: #ffffff;
}

body.dark .notif-dropdown {
  background: #1e1e1e; /* Dark background for notifications dropdown */
  border-color: #444; /* Darker border for dropdown */
}

body.dark .notif-title {
  color: #ffffff; /* White title for notifications */
}

body.dark .notif-item {
  color: #e0e0e0; /* Lighter text for notification items */
  border-color: #333; /* Darker border between notification items */
}

body.dark .notif-item:hover {
  background-color: #eb3d3d; /* Hover background remains the same or adjust */
}

body.dark .no-notif {
  color: #aaa; /* Lighter grey for no notifications text */
}

body.dark .dropdown-content {
  background-color: #1e1e1e; /* Dark mode background for settings dropdown */
  border: 1px solid #444; /* Darker border */
  color: #ffffff; /* White text for dropdown content */
}

/* --- Image Dark Mode Styles --- */

/* Hamburger and Notification Icons */
body.dark .more-icon,
body.dark .header-icon, /* This applies to the bell icon */
body.dark .sidebar-icon /* This applies to all sidebar icons like upload, profile, contact, settings, logout */
{
  filter: invert(1) hue-rotate(180deg) brightness(0.8); /* Adjust values as needed */
}

/* Specific adjustment for the magnifier grid items if they become too bright/distracting */
body.dark .grid-item {
  filter: invert(1) hue-rotate(180deg) brightness(0.5) opacity(0.3); /* More subtle for background */
}

/* Optional: If you have profile images, you might want a more subtle filter or none at all */
body.dark .profile-img {
  filter: brightness(0.9); /* Slightly darken, or remove filter if not desired */
}

/* Adjust card icons if they need to stand out more */
body.dark .dashboard-card .card-icon {
    filter: brightness(1.2) drop-shadow(1px 1px 1px rgba(255, 255, 255, 0.5)); /* Make them brighter and add a white shadow */
}

</style>