<template>
  <div class="background-decor-grid">
    <img
      v-for="n in 60"
      :key="n"
      src="@/assets/images/megaphone.png"
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
      <img src="@/assets/images/bell.png" alt="Notifications" class="header-icon" />
      <img src="@/assets/images/search.png" alt="Search" class="header-icon" />
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

      <!-- Logo Section -->
      <div class="sidebar-logo">
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
        <router-link to="/profile" class="sidebar-link">
          <img src="@/assets/images/Sidebar.png" class="sidebar-icon" alt="Profile Icon" />
          My Profile
        </router-link>

        <router-link to="/contact-dev" class="sidebar-link">
          <img src="@/assets/images/devs.png" class="sidebar-icon" alt="Contact Icon" />
          Contact Dev
        </router-link>

        <router-link to="/settings" class="sidebar-link">
          <img src="@/assets/images/sett.png" class="sidebar-icon" alt="Settings Icon" />
          Settings
        </router-link>

        <a class="sidebar-link" @click="handleLogout">
          <img src="@/assets/images/logout.png" class="sidebar-icon" alt="Logout Icon" />
          Log Out
        </a>
      </nav>

      <!-- Bottom Profile Info -->
      <div class="sidebar-profile">
  <img src="@/assets/images/user.png" alt="Profile Picture" class="profile-img" />
  <div class="profile-info">
    <p class="profile-name">{{ user?.username || 'Guest' }}</p>
    <p class="profile-email">{{ user?.email || 'guest@example.com' }}</p>
  </div>
</div>
    </div>
  </transition>




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




</template>

<script>
export default {
  data() {
    return {
      sidebarOpen: false,
      touchStartX: 0,
      touchEndX: 0,
      mouseDownX: 0,
      mouseUpX: 0,
      user: null // 👤 Store user here
    };
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
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
  this.$router.push('/login'); // redirect to login page
}
  }
};
</script>



<style scoped>


/* Animation for Sidebar */
.sidebar-drag-handle {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  width: 8px;
  height: 80px;
  background-color: #000000;
  border-radius: 4px;
  opacity: 2;
  cursor: pointer;
  filter: drop-shadow(1px 1px 4px rgb(0, 0, 0));

}

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
}

.sidebar-logo-title {
  font-size: 28px;
  color: black;
  font-family: 'Bebas Neue', sans-serif;
  margin-top: 6px;
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
  opacity: 0.7;
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



</style>