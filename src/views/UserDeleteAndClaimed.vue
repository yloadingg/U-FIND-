<template>
  <div class="user-item-details">
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
    <h1 class="page-title">Item Delete And Claimed</h1>

    <div v-if="item" class="card">
      <!-- Top: Image -->
      <div class="image-section">
        <img :src="item.image_url" alt="Lost Item" class="item-image" />
      </div>

      <!-- Middle: Details -->
      <div class="item-info">
        <div class="info-line">
          <span class="label">Description:</span>
          <span>{{ item.description }}</span>
        </div>

        <div class="info-line">
          <span class="label">Category:</span>
          <span>{{ item.category }}</span>
        </div>
      
        <div class="info-line">
          <span class="label">Date Lost:</span>
          <span>{{ formatDate(item.date_lost) }}</span>
        </div>
        <div class="info-line">
          <span class="label">Location:</span>
          <span>{{ item.location }}</span>
        </div>
      </div>

      <!-- Bottom: Buttons -->
      <div class="button-group">
        <button class="action-btn delete" @click="deleteItem">
          DELETE
        </button>
        <button class="action-btn claim" @click="markAsClaimed">
          MARK AS CLAIMED
        </button>
      </div>
    </div>

    <div v-else class="loading">Loading item...</div>
  </div>
</template>


<script>
export default {
  data() {
    return { item: null };
  },
  created() {
    this.fetchItemDetails();
  },
  methods: {
    async fetchItemDetails() {
      const id = this.$route.params.id;
      const token = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user"));
      try {
        const res = await fetch(
          `http://localhost:3000/api/lost-items/user/${userData.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch user items");
        const items = await res.json();
        this.item = items.find((i) => i.id === parseInt(id));
      } catch (err) {
        console.error("Error fetching item:", err);
      }
    },
    formatDate(dateStr) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },
    async deleteItem() {
      if (!confirm("Are you sure you want to delete this item?")) return;
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `http://localhost:3000/api/lost-items/${this.item.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Delete failed");
        alert("Item deleted successfully");
        this.$router.push("/lost");
      } catch (err) {
        alert("Failed to delete item: " + err.message);
      }
    },
    async markAsClaimed() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `http://localhost:3000/api/lost-items/${this.item.id}/claim`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Claim update failed");
        alert("Item marked as claimed!");
        this.$router.push("/UserItemUploaded");
      } catch (err) {
        alert("Failed to update item: " + err.message);
      }
    },
    goBack() {
      this.$router.push("/UserItemUploaded");
    },
  },
};
</script>

<style scoped>
.user-item-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
  position: relative;
}

.logo {
  width: 48px;
  height: 48px;
  position: absolute;
  top: 10px;
  left: 10px;
}

.back-button {
  width: 30px;
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  height: auto; /* auto height, fits content */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-section {
  width: 100%;
  height: 280px; /* fixed image area */
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.item-info {
  width: 100%;
  margin: 1rem 0;
  color: black;
  font-size: 1rem;
}

.info-line {
  display: flex;
  margin-bottom: 0.5rem;
}

.label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.button-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
  font-weight: bold;
}

.action-btn.delete {
  background-color: #ff4d4f;
  color: white;
  filter: drop-shadow(1px 1px 3px rgb(211, 83, 74));
}

.action-btn.claim {
  background-color: #4caf50;
  color: white;
  filter: drop-shadow(1px 1px 3px rgb(30, 153, 56));
}

.action-btn:hover {
  transform: scale(1.05);

}

.page-title {
  font-size:36px;
  text-align: center;
  color: black;
  font-family: 'Bebas Neue', sans-serif;
}

.logo {
  width: 48px;
  height: 48px;
  position: absolute;
  top: 10px;
  left: 10px;
}

.back-button {
  width: 40px;
  height: 40px;
  top: 9px;
  right: 12px;
  cursor: pointer;
}

</style>