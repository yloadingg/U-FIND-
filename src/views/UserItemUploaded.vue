<template>
    <div class="uploaded-items-container">
      <!-- Logo -->
      <img src="@/assets/images/DEC.png" alt="Logo" class="logo" />
  
      <!-- Back Button -->
      <img
        src="@/assets/images/return.png"
        alt="Back"
        class="back-button"
        @click="goBack"
      />
  
      <!-- Title -->
      <h2 class="title">Your Uploaded Items</h2>
  
      <!-- Empty State -->
      <div v-if="uploadedItems.length === 0" class="no-items">
        <p>Nothing here for now...</p>
      </div>
  
      <!-- Uploaded Items Grid -->
      <div v-else class="grid">
        <div
          class="item-card"
          v-for="item in uploadedItems"
          :key="item.id"
          @click="goToItemDetails(item)"
        >
          <img :src="item.image_url" alt="Uploaded Item" class="item-image" />
          <div class="item-info">
            <p><strong>Description:</strong> {{ item.description }}</p>
            <p><strong>Date Lost:</strong> {{ formatDate(item.date_lost) }}</p>
            <p><strong>Location:</strong> {{ item.location }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        uploadedItems: [],
      };
    },
    created() {
      this.fetchUserItems();
    },
    methods: {
      async fetchUserItems() {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
  
        if (!userData || !token) {
          console.error("User not logged in");
          return;
        }
  
        const user = JSON.parse(userData);
        try {
          const res = await fetch(`http://localhost:3000/api/lost-items/user/${user.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          if (!res.ok) throw new Error("Failed to fetch user items");
  
          const data = await res.json();
          this.uploadedItems = data;
        } catch (err) {
          console.error("Fetch error:", err);
        }
      },
      formatDate(dateStr) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
      },
      goToItemDetails(item) {
        this.$router.push({ name: 'UserDeleteClaimed', params: { id: item.id } });
      },
      goBack() {
        this.$router.push('/dashboard');
      }
    }
  };
  </script>
  
  <style scoped>
  .uploaded-items-container {
    padding: 1rem;
    text-align: center;
    position: relative;
  }
  
  .logo {
    width: 100px;
    position: absolute;
    top: 10px;
    left: 10px;
  }
  
  .back-button {
    width: 30px;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
  
  .title {
    margin-top: 60px;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  .no-items {
    font-size: 1.2rem;
    color: gray;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .item-card {
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: 0.2s;
  }
  
  .item-card:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .item-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .item-info {
    padding: 0.5rem;
    text-align: left;
  }
  </style>
  