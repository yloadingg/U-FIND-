<template>
  <div class="feed-container">
    <!-- Header Row -->
    <div class="header">
      <img :src="logoImg" alt="Logo" class="logo" />

      <h1 class="feed-title">LOST ITEM FEED</h1>

      <!-- Search Box -->
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Room/Facility"
          class="search-input"
        />
        <img :src="searchIcon" alt="Search" class="search-icon" />
      </div>

      <!-- Back Button -->
      <img
        :src="backIcon"
        alt="Back"
        class="back-button"
        @click="goBack"
      />
    </div>

    <!-- No Items or No Match -->
    <div v-if="lostItems.length === 0" class="empty-message">
      Nothing here for now...
    </div>
    <div v-else-if="filteredItems.length === 0" class="empty-message">
      No results found.
    </div>

    <!-- Scrollable Grid of Items -->
    <div
      v-else
      class="scrollable-wrapper"
    >
      <div
        class="item-grid"
      >
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="item-box"
          @click="$router.push(`/lost-item/${item.id}`)"
        >
          <img :src="item.image_url" class="item-image" />
          <div class="item-details">
            <p><strong>Description:</strong> {{ item.description }}</p>
            <p><strong>Date Lost:</strong> {{ formatDate(item.date_lost) }}</p>
            <p><strong>Room/Facility:</strong> {{ item.location }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logoImg from '@/assets/images/DEC.png';
import searchIcon from '@/assets/images/search.png';
import backIcon from '@/assets/images/return.png';

export default {
  data() {
    return {
      lostItems: [],
      searchQuery: '',
      logoImg,
      searchIcon,
      backIcon
    };
  },
  created() {
    fetch("http://localhost:3000/api/lost-items")
      .then(res => res.json())
      .then(data => {
        this.lostItems = data.filter(item => item.is_claimed === 0);
      })
      .catch(err => console.error("Fetch failed:", err));
  },
  computed: {
    filteredItems() {
      if (!this.searchQuery) return this.lostItems;
      const query = this.searchQuery.toLowerCase();
      return this.lostItems.filter(item =>
        item.location.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    goBack() {
      this.$router.push('/dashboard');
    },
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    }
  }
};
</script>

<style scoped>
.feed-container {
  background: white;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Header Row */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 20px;
}

.logo {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 48px;
  height: 48px;
}

.feed-title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  font-family: 'Bebas Neue', sans-serif;
  margin: 0 auto;
  color: black;
  flex: 1;
  padding-left: 14rem;
}

.search-container {
  position: relative;
  width: 220px;
  right: 4rem;
}

.search-input {
  padding: 8px 32px 8px 12px;
  border: 1px solid #000000;
  border-radius: 10px;
  width: 100%;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  height: 18px;
  opacity: 0.8;
}


.back-button {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.2s ease;

}

.empty-message {
  text-align: center;
  font-size: 1.8rem;
  color: rgb(100, 100, 100);
  margin-top: 7rem;
  font-weight: 500;
}

/* Scrollable Grid Wrapper */
.scrollable-wrapper {
  overflow-y: auto;
  max-height: calc(100vh - 80px);
  padding-right: 0.5rem;
  padding-left: 1rem;
  padding-top: 1rem;

}

/* Grid Display */
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding-bottom: 2rem;
}

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


.search-input{
  font-weight: bold;
}
</style>
