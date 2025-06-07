<template>
  <div class="background-decor-grid">
    <img
      v-for="n in 60"
      :key="n"
      src="@/assets/images/magnifier.png"
      class="grid-item"
    />
  </div>

  <!-- Header -->
  <div class="dashboard-header">
    <div class="header-left">
      <img src="@/assets/images/more.png" alt="More Icon" class="more-icon" @click="toggleSidebar" />
      <img src="@/assets/images/DEC.PNG" alt="U Icon" class="u-icon" />
      <span class="header-title"> U DASHBOARD</span>
    </div>
    <div class="header-right">
</div>
  </div>

  <!-- Sidebar -->
  <transition name="slide-fade">
    <div 
      v-if="sidebarOpen" 
      class="sidebar"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
    >
      <!-- Drag Handle (Swipe Bar) -->
      <div class="sidebar-drag-handle"></div>

 <!-- Logo Section inside Sidebar -->
<div class="sidebar-logo">
  <!-- Hamburger Close Icon -->
  <img 
    src="@/assets/images/more.png" 
    alt="Close Sidebar" 
    class="sidebar-hamburger" 
    @click="toggleSidebar"
  />
  
  <!-- Logo -->
  <img src="@/assets/images/DEC.png" alt="Logo" class="sidebar-logo-img" />
  <h1 class="sidebar-logo-title">U FIND</h1>
</div>

      <!-- Uploaded Item Link -->
      <router-link to="/UserItemUploaded" class="sidebar-link sidebar-link-active">
        <img src="@/assets/images/upload.png" class="sidebar-icon" alt="Upload Icon" />
        Uploaded Item
      </router-link>

<!-- Menu Links -->
<nav class="sidebar-nav">
  <router-link to="/MyProfile" class="sidebar-link">
    <img src="@/assets/images/Sidebar.png" class="sidebar-icon" alt="Profile Icon" />
    My Profile
  </router-link>

  <a href="mailto:devemail@example.com" class="sidebar-link">
  <img src="@/assets/images/devs.png" class="sidebar-icon" alt="Contact Icon" />
  Contact Dev
</a>
<!-- Settings dropdown -->
<div class="sidebar-link settings-dropdown">
  <img src="@/assets/images/sett.png" class="sidebar-icon" alt="Settings Icon" />
  <span>Settings</span>

  <!-- Dropdown content shown on hover -->
  <div class="dropdown-content">
    <span>Dark Mode</span>
    <label class="switch">
      <input type="checkbox" v-model="darkMode" />
      <span class="slider round"></span>
    </label>
  </div>
</div>

<!-- side bar log out-->
  <a class="sidebar-link" @click="handleLogout">
    <img src="@/assets/images/logout.png" class="sidebar-icon" alt="Logout Icon" />
    Log Out
  </a>
</nav>


      <!-- Bottom Profile Info -->
      <div class="sidebar-profile">
  <img :src="user.profile_url || defaultProfile" alt="Profile Picture" class="profile-img" />
  <div class="profile-info">
    <p class="profile-name">{{ user?.username || 'Guest' }}</p>
    <p class="profile-email">{{ user?.email || 'guest@example.com' }}</p>
  </div>
</div>
</div>
  </transition>


<!---Dashboard cards -->
<div class="dashboard-cards">
  <router-link to="/add-item" class="dashboard-card zoom-in">
    <img src="@/assets/images/add.png" alt="Add Icon" class="card-icon" />
    <p class="card-text">UPLOAD MISSING ITEM</p>
  </router-link>

  <router-link to="/lost" class="dashboard-card zoom-in">
    <img src="@/assets/images/comment.png" alt="Message Icon" class="card-icon" />
    <p class="card-text">LOST ITEM FEED</p>
  </router-link>

  <router-link to="/found" class="dashboard-card zoom-in">
    <img src="@/assets/images/megaphone.png" alt="Megaphone Icon" class="card-icon" />
    <p class="card-text">CLAIMED ITEM FEED</p>
  </router-link>
</div>



<!-- Notifications Dropdown -->
<div 
  class="notif-wrapper" 
  @mouseenter="notificationsOpen = true; fetchNotifications()" 
  @mouseleave="notificationsOpen = false"
>
  <img src="@/assets/images/bell.png" alt="Notifications" class="header-icon" />
  
  <div v-if="notificationsOpen" class="notif-dropdown">
    <h3 class="notif-title">Notifications</h3>

    <div v-if="notifications.length">
      <div 
        v-for="notif in notifications" 
        :key="notif.id" 
        class="notif-item" 
        @click="goToPost(notif.post_id)"
      >
        <strong>{{ notif.commenter_name }}</strong> commented on your post.
      </div>
    </div>

    <div v-else class="no-notif">No notifications yet.</div>
  </div>
</div>







</template>

<script>
import defaultProfile from '@/assets/images/user.png';

export default {
  data() {
    return {
      sidebarOpen: false,
      touchStartX: 0,
      touchEndX: 0,
      mouseDownX: 0,
      mouseUpX: 0,
      user: null,
      notificationsOpen: false,
      notifications: [],
      defaultProfile,

      // ✅ Dark Mode
      darkMode: false,
    };
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchNotifications();
    }
  },
  mounted() {
    // ✅ Load dark mode state
    const saved = localStorage.getItem('darkMode');
    this.darkMode = saved === 'true';
    this.updateDarkMode();
  },
  watch: {
    // ✅ Save dark mode toggle
    darkMode(val) {
      localStorage.setItem('darkMode', val);
      this.updateDarkMode();
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    handleTouchStart(event) {
      this.touchStartX = event.changedTouches[0].screenX;
    },
    handleTouchEnd(event) {
      this.touchEndX = event.changedTouches[0].screenX;
      this.handleSwipeGesture(this.touchStartX, this.touchEndX);
    },
    handleMouseDown(event) {
      this.mouseDownX = event.screenX;
    },
    handleMouseUp(event) {
      this.mouseUpX = event.screenX;
      this.handleSwipeGesture(this.mouseDownX, this.mouseUpX);
    },
    handleSwipeGesture(startX, endX) {
      const swipeDistance = startX - endX;
      if (swipeDistance > 50) {
        this.sidebarOpen = false;
      }
    },
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
    toggleNotifications() {
      this.notificationsOpen = !this.notificationsOpen;
      if (this.notificationsOpen) {
        this.fetchNotifications();
      }
    },
    async fetchNotifications() {
      if (this.user && this.user.id) {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:3000/api/notifications/${this.user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!res.ok) throw new Error('Network error: ' + res.status);
          const data = await res.json();
          this.notifications = data;
          console.log('Notifications fetched:', data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      }
    },
    async clearNotifications() {
      this.notifications = [];
      try {
        await fetch(`http://localhost:3000/api/notifications/${this.user.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (err) {
        console.error('Failed to clear notifications:', err);
      }                                                                               
    },
    goToPost(postId) {
      this.$router.push(`/lost-item/${postId}`);
    },
    updateProfileImage(newUrl) {
      if (this.user) {
        this.user.profile_url = newUrl;
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    },

    // ✅ Dark Mode Methods
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    updateDarkMode() {
      if (this.darkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }
};
</script>




<style scoped>


/* Animation for Sidebar */

.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Sidebar Styles */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 999;
  font-family: 'Bebas Neue', sans-serif;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  
}

.sidebar-logo-img {
  width: 45px;
  height: 45px;
  position: absolute;
  margin-bottom: 4rem;
  margin-left: 3rem;
}

.sidebar-logo-title {
  font-size: 28px;
  color: black;
  font-family: 'Bebas Neue', sans-serif;
  margin-top: 6px;
  position: absolute;
  margin-bottom: 4rem;
  margin-left: 6.5rem;
}

.sidebar-nav {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #000000;
  font-size: 1.4rem;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 500;
  font-family: 'Bebas Neue', sans-serif;
}

.sidebar-hamburger {
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-right: 8px;
  position: absolute;
  margin-bottom: 4rem;
  margin-left: 0.5rem;
}
.sidebar-link:hover {
  background-color: #f13131;
}

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-weight: 300;
  font-size: 0.9rem;
  color: #000000;
}

.profile-email {
  font-size: 0.8rem;
  color: #f32c2c;
  font-weight: bold;
}

.sidebar-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.sidebar-link-active {
  background-color: #f13131;
  color: #ffffff;
  filter: drop-shadow(1px 1px 7px rgb(214, 31, 31));

}
.sidebar-link-active:hover {
  background-color: #d92a2a;
}

/* dropdown Styles */

/* Make sure the parent has relative positioning */
.settings-dropdown {
  position: relative;
}

/* Show dropdown on hover */
.settings-dropdown:hover .dropdown-content {
  display: flex;
}

/* Dropdown positioned BELOW the "Settings" */
.dropdown-content {
  display: none;
  position: absolute;
  top: 100%; /* 👈 Pushes it below */
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 999;
  width: 227px;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  font-family: 'Bebas Neue', sans-serif;
}


/* Switch Styles */
.switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 22px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #f13131;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

/* Main shi */

.dashboard-container {
  padding: 10px;
  font-family: 'Arial Black', sans-serif;
  background-color: white;

}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  position: relative; /* 👈 Add this */
  z-index: 1;         /* 👈 Add this */

}

.header-left {
  display: flex;
  align-items: center;
  margin-top: 5px;
  
}

.header-right {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  margin-right: 10px;
}

.header-icon {
  width: 30px;
  height: 30px;
 
}

.more-icon{
  width: 30px;
  height: 30px;
  margin-bottom: 7px;
  margin-left: 8px;
}

.u-icon{
  width: 50px;
  height: 50px;
  margin-left: 20px;
  margin-bottom: 5px;
}

.header-title {
  font-size: 40px;
  margin-left: 10px;
  color: black;
  font-family: 'Bebas Neue', sans-serif;
}

.user-icon{
  width: 50px;
  height: 50px;
  transition: transform 0.7s ease;
  padding-right: 20px;
  padding-bottom: 20px;
}

.dashboard-cards {
  display: flex;
  padding-top: 50px;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 100px; /* <-- added to lower the cards */
}

.dashboard-card {
  background-color: #e31c1c;
  width: 300px;
  height: 230px;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 20px;
  transition: transform 0.7s ease;
  text-align: center;
  filter: drop-shadow(1px 1px 10px rgb(0, 0, 0));
  animation: zoomIn 0.6s ease;
}

.dashboard-card:hover {
  transform: scale(1.05);
  cursor: pointer;
  filter: drop-shadow(1px 1px 10px rgb(212, 31, 31));
}

.card-icon {
  width: 60px;
  height: 60px;
  z-index: 1;
 filter: drop-shadow(1px 1px 1px rgb(0, 0, 0));
}

.card-text {
  font-size: 32px;
  position: absolute;
  top: 60%; /* adjust this to push it lower */
  transform: translateY(-50%);
  text-align: center;
  padding-top: 140px;
  font-family: 'Bebas Neue', sans-serif;
  font-weight: 550;
  filter: drop-shadow(1px 1px 1px rgb(0, 0, 0));
 
}

.background-decor-grid {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(6, 11fr);
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

.grid-item {
  justify-self: center;
  align-self: center;
  width: 40px;
  height: auto;
  animation: float 8s infinite ease-in-out;
}

@keyframes float {
  0%   { transform: translateY(0px); }
  50%  { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes zoomIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.zoom-in {
  animation: zoomIn 0.5s ease forwards;
}


/* NOTIF WRAPPER */

.notif-wrapper {
  position: relative;
  display: inline-block;
}

/* NOTIF ICON */
.notif-icon {
  cursor: pointer;
  font-size: 24px;
  position: relative;
}

/* DROPDOWN */
.notif-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 1000;
  padding: 10px;
  border-radius: 8px;
}

.notif-wrapper:hover .notif-dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.notif-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 24px;
  margin-bottom: 10px;
  color: #000;
}

.notif-item {
  padding: 10px;
  font-size: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  color: #000;
  font-family: Arial, Helvetica;
}

.notif-item strong {
  font-weight: bold !important;
}

.notif-item:hover {
  background-color: #eb3d3d;;
  border-radius: 10px;
}

.no-notif {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #999;
}

.notif-wrapper {
  position: absolute;
  top: 13px;
  right: 10px;
  z-index: 1000;
}


/* Small devices (phones, 600px and below) */
@media (max-width: 600px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;
  }

  .header-title {
    font-size: 28px;
    margin-left: 0;
    margin-top: 10px;
  }

  .u-icon {
    width: 40px;
    height: 40px;
    margin-left: 0;
  }

  .more-icon {
    width: 25px;
    height: 25px;
    margin-left: 0;
  }

  .dashboard-cards {
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    margin-top: 40px;
    gap: 20px;
  }

  .dashboard-card {
    width: 90%;
    height: 200px;
    font-size: 18px;
  }

  .sidebar {
    width: 220px;
    padding: 0.5rem;
  }

  .sidebar-logo-img {
    width: 35px;
    height: 35px;
    margin-left: 2rem;
  }

  .sidebar-logo-title {
    font-size: 24px;
    margin-left: 5.5rem;
  }

  .sidebar-link {
    font-size: 1.2rem;
    gap: 10px;
  }

  .notif-wrapper {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .header-icon {
    width: 25px;
    height: 25px;
  }
}

/* Medium devices (tablets, 768px and below) */
@media (max-width: 768px) {
  .dashboard-cards {
    gap: 30px;
    margin-top: 60px;
  }

  .dashboard-card {
    width: 250px;
    height: 210px;
    font-size: 18px;
  }

  .header-title {
    font-size: 32px;
  }

  .sidebar {
    width: 240px;
  }

  .sidebar-link {
    font-size: 1.3rem;
  }

  .sidebar-logo-title {
    font-size: 26px;
  }
}

/* Large devices (up to small desktops, 1024px) */
@media (max-width: 1024px) {
  .dashboard-card {
    width: 280px;
    height: 220px;
  }

  .dashboard-cards {
    gap: 35px;
  }

  .header-title {
    font-size: 36px;
  }
}
/* === Responsive Header and Logo === */

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .header-left {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 0;
    gap: 10px;
  }

  .more-icon {
    width: 24px;
    height: 24px;
    margin-left: 0;
    margin-bottom: 0;
  }

  .u-icon {
    width: 40px;
    height: 40px;
    margin-left: 0;
    margin-bottom: 0;
  }

  .header-title {
    font-size: 28px;
    margin-left: 5px;
    margin-top: 5px;
  }

  .header-right {
    margin-right: 0;
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .header-title {
    font-size: 24px;
  }

  .u-icon {
    width: 35px;
    height: 35px;
  }

  .more-icon {
    width: 22px;
    height: 22px;
  }
}

</style>