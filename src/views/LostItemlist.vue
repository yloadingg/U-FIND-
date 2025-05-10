<template>
    <div class="feed-container">
      <!-- Header Row -->
      <div class="header">
        <img src="@/assets/images/DEC.png" alt="Logo" class="logo" />
        <h1 class="feed-title">LOST ITEM FEED</h1>
        <img
          src="@/assets/images/return.png"
          alt="Back"
          class="back-button"
          @click="goBack"
        />
      </div>
  
      <!-- Feed Content -->
      <div v-if="lostItems.length === 0" class="empty-message">
        Nothing here for now...
      </div>
      <div
        v-else
        :class="{
          'item-row': lostItems.length < 3,
          'item-grid': lostItems.length >= 3
        }"
      >
        <div v-for="item in lostItems" :key="item.id" class="item-box">
          <img :src="item.image_url" class="item-image" />
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
export default {
  data() {
    return {
      lostItems: []
    };
  },
  created() {
    fetch("http://localhost:3000/api/lost-items")
      .then(res => res.json())
      .then(data => this.lostItems = data)
      .catch(err => console.error("Fetch failed:", err));
  },
  methods: {
    goBack() {
      this.$router.push('/dashboard');
    }
  }
};
</script>

  
<style scoped>
.feed-container {
  background: white;

}

/* Header Row */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  /* Instead of margin-bottom on the back button, try padding-bottom on the header */
  padding-bottom: 100px; /* Adjust this value as needed */
}

.logo {
  width: 50px;
  height: 50px;
}

.feed-title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  flex-grow: 1;
  font-family: 'Bebas Neue', sans-serif;
  margin: 0;
  color: black;
}

.back-button {
  width: 40px;
  height: 40px;
  cursor: pointer;
  /* Remove the margin-bottom */
  /* margin-bottom: 100px; */
 padding-right: 5px;
}
/* Message if no items yet */
.empty-message {
  text-align: center;
  font-size: 2rem;
  color: rgb(0, 0, 0);
  margin-top: 7rem;
}

/* Layout styles */
.item-row {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.item-box {
  width: 250px;
  height: 200px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 2);
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
