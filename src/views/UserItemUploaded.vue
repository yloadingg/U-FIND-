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

    <!-- Uploaded Items Scrollable Grid -->
    <div v-else class="scrollable-wrapper">
      <div class="item-grid">
        <div
          class="item-box"
          v-for="item in uploadedItems"
          :key="item.id"
          @click="goToItemDetails(item)"
        >
          <img :src="item.image_url" alt="Uploaded Item" class="item-image" />
          <div class="item-details">
            <p><strong>Description:</strong> {{ item.description }}</p>
            <p><strong>Date Lost:</strong> {{ formatDate(item.date_lost) }}</p>
            <p><strong>Location:</strong> {{ item.location }}</p>
          </div>
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
  background: white;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.logo {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 48px;
  height: 48px;
}

.back-button {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  font-family: 'Bebas Neue', sans-serif;
  color: black;
}

.no-items {
  text-align: center;
  font-size: 1.8rem;
  color: rgb(100, 100, 100);
  margin-top: 7rem;
  font-weight: 500;
}

/* Scrollable Wrapper */
.scrollable-wrapper {
  overflow-y: auto;
  max-height: calc(100vh - 100px);
  padding: 1.5rem 1rem 2rem;
  
}

/* Grid Layout */
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

/* Item Card Styling */
.item-box {
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.item-box:hover {
  transform: scale(1.01);
  filter: drop-shadow(0px 0px 5px rgb(0, 0, 0));
  z-index: 2;
}

.item-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.item-details {
  padding: 0.75rem;
  background-color: #fff;
  color: black;
  font-size: 0.9rem;
  line-height: 1.4;
}

.item-details p strong {
  font-weight: bold !important;
}
</style>
