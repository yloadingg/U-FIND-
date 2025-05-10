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
  
      <div v-if="item" class="content">
        <!-- Item Image -->
        <img :src="item.image_url" alt="Lost Item" class="item-image" />
  
        <!-- Details -->
        <div class="item-info">
          <p><strong>Description:</strong> {{ item.description }}</p>
          <p><strong>Date Lost:</strong> {{ formatDate(item.date_lost) }}</p>
          <p><strong>Location:</strong> {{ item.location }}</p>
        </div>
  
        <!-- Buttons -->
        <div class="button-group">
          <button class="delete-btn" @click="deleteItem">Delete</button>
          <button class="claim-btn" @click="markAsClaimed">Mark as Claimed</button>
        </div>
      </div>
      <div v-else class="loading">Loading item...</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        item: null
      };
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
          const res = await fetch(`http://localhost:3000/api/lost-items/user/${userData.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
  
          if (!res.ok) throw new Error("Failed to fetch user items");
  
          const items = await res.json();
          this.item = items.find(i => i.id === parseInt(id));
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
          const res = await fetch(`http://localhost:3000/api/lost-items/${this.item.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (!res.ok) throw new Error("Delete failed");
  
          alert("Item deleted successfully");
          this.$router.push("/user-items");
        } catch (err) {
          alert("Failed to delete item: " + err.message);
        }
      },
      async markAsClaimed() {
        const token = localStorage.getItem("token");
  
        try {
          const res = await fetch(`http://localhost:3000/api/lost-items/${this.item.id}/claim`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (!res.ok) throw new Error("Claim update failed");
  
          alert("Item marked as claimed!");
          this.$router.push("/user-items");
        } catch (err) {
          alert("Failed to update item: " + err.message);
        }
      },
      goBack() {
        this.$router.push("/UserItemUploaded");
      }
    }
  };
  </script>
  
  <style scoped>
  .user-item-details {
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
  
  .item-image {
    max-width: 90%;
    max-height: 300px;
    margin: 60px auto 20px;
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .item-info {
    text-align: left;
    max-width: 500px;
    margin: 0 auto 1.5rem;
    font-size: 1.1rem;
  }
  
  .button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  
  .delete-btn,
  .claim-btn {
    padding: 0.7rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s;
  }
  
  .delete-btn {
    background-color: #ff4d4f;
    color: white;
  }
  
  .claim-btn {
    background-color: #4caf50;
    color: white;
  }
  
  .delete-btn:hover {
    background-color: #d9363e;
  }
  
  .claim-btn:hover {
    background-color: #3c8d3d;
  }
  
  .loading {
    margin-top: 100px;
    font-size: 1.2rem;
    color: gray;
  }
  </style>
  