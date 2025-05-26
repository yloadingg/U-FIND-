<template>
  <div class="claimed-items-container">
    <!-- Logo -->
    <img src="@/assets/images/DEC.png" alt="Logo" class="logo" />

    <!-- Centered Title -->
    <div class="header-center">
      <h2 class="title">Claimed Items</h2>
    </div>

    <!-- Back Button -->
    <img
      src="@/assets/images/return.png"
      alt="Back"
      class="back-button"
      @click="goBack"
    />

    <!-- Empty State -->
    <div v-if="claimedItems.length === 0" class="no-items">
      <p>No items have been marked as claimed yet.</p>
    </div>

    <!-- Scrollable Grid of Claimed Items -->
    <div v-else class="scroll-container">
      <div class="grid">
        <div
          class="item-card"
          v-for="item in claimedItems"
          :key="item.id"
        >
          <img
            :src="item.image_url"
            alt="Claimed Item"
            class="item-image"
            @click="openPreview(item.image_url)"
          />
          <div class="item-info">
            <p><strong>Description:</strong> {{ item.description }}</p>
            <p><strong>Date Claimed:</strong> {{ formatDate(item.date_claimed) }}</p>
            <p><strong>Room/Facility:</strong> {{ item.location }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Overlay -->
    <div v-if="previewImage" class="image-preview-overlay" @click.self="closePreview">
      <img :src="previewImage" alt="Preview" class="preview-image" />
      <button class="close-button" @click="closePreview">X</button>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      claimedItems: [],
      previewImage: null // holds the image URL for preview
    };
  },
  created() {
    fetch("http://localhost:3000/api/claimed-items")
      .then(res => res.json())
      .then(data => {
        this.claimedItems = data;
      })
      .catch(err => console.error("Fetch failed:", err));
  },
  methods: {
    goBack() {
      this.$router.push('/dashboard');
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    openPreview(imageUrl) {
      this.previewImage = imageUrl;
    },
    closePreview() {
      this.previewImage = null;
    }
  }
};
</script>


<style scoped>
.claimed-items-container {
  position: relative;
  text-align: center;
  max-height: 100vh;
  overflow: hidden;
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

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
}

.title {
  font-size: 36px;
  font-weight: bold;
  font-family: 'Bebas Neue', sans-serif;
  color: black;
  margin: 0;
  pointer-events: auto;
}

.no-items {
  margin-top: 5rem;
  font-size: 1.2rem;
  color: gray;
}

.scroll-container {
  margin-top: 5rem;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  padding-right: 8px;
  padding-left: 1rem;
  padding-top: 0.7rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

}

.item-card {
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

.item-card:hover {
  transform: scale(1.01);
  filter: drop-shadow(0px 0px 5px rgb(0, 0, 0));
}

.item-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.item-info {
  padding: 0.75rem;
  text-align: left;
  color: black;
  line-height: 1.4;
}

.item-info p strong {
  font-weight: bold !important;
}

/* Image preview overlay */
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.preview-image {
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.close-button {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: background 0.2s ease;
}

.close-button:hover {
  background: #f0f0f0;
}


</style>
 