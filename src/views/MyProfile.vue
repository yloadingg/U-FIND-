<template>
  <div>
    <!-- Header -->
    <header class="page-header">
      <div class="header-left">
        <img src="@/assets/images/DEC.png" alt="Logo" class="logo" />
      </div>
      <div class="header-center">
        <h1 class="page-title">My Profile</h1>
      </div>
      <div class="header-right">
  <img
    src="@/assets/images/return.png"
    alt="Back"
    class="back-button-img"
    @click="$router.back()"
  />
</div>
    </header>

    <!-- Profile Section -->
    <div class="profile-container">
      <div class="profile-card">

        <!-- Profile Image Preview -->
        <div class="profile-image">
          <img
            :src="previewImage || user.profile_url || defaultImage"
            alt="Profile Picture"
          />
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            style="display: none;"
            accept="image/*"
          />
        </div>

        <!-- Upload Button -->
        <button class="upload-btn" @click="$refs.fileInput.click()">
          Upload Profile
        </button>

        <!-- User Info -->
        <div class="info">
          <p class="label">EMAIL:</p>
          <p class="value">{{ user.email }}</p>

          <p class="label">USERNAME:</p>
          <p class="value">{{ user.username }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button
            class="save-btn"
            @click="saveChanges"
            :disabled="!selectedImage"
          >
            Save
          </button>
          <button
            class="cancel-btn"
            @click="cancelUpload"
            :class="{ active: selectedImage }"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultProfile from '@/assets/images/user.png';

export default {
  data() {
    return {
      selectedImage: null,
      previewImage: null,
      user: JSON.parse(localStorage.getItem('user')) || {},
      defaultImage: defaultProfile
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedImage = file;
        this.previewImage = URL.createObjectURL(file);
      }
    },
    cancelUpload() {
      if (this.previewImage) {
        URL.revokeObjectURL(this.previewImage); // Clean up
      }
      this.selectedImage = null;
      this.previewImage = null;
    },
    async saveChanges() {
  if (!this.selectedImage) return;

  const formData = new FormData();
  formData.append('profile', this.selectedImage);

  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:3000/api/profile/picture', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`  // ✅ Corrected here
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      this.user.profile_url = data.profile_url;
      localStorage.setItem('user', JSON.stringify(this.user)); // ✅ You already added this correctly
      this.$emit('profile-updated', data.profile_url);
      alert('Profile picture updated!');
      this.cancelUpload();
    } else {
      alert(data.error || 'Failed to update profile picture');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred while uploading.');
  }
}
  }
};
</script>

  
  <style scoped>
  .profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin-bottom: 5rem;

  }
  
  .profile-card {
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    width: 460px;

    text-align: center;
    margin-bottom: 5rem;
  }
  
  .profile-image {
    position: relative;
    width: 130px;
    height: 130px;
    margin: 0 auto 20px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #ccc;
  }
  
  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .profile-image input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  
  .upload-btn {
    background-color: #f63b3b;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  
  .upload-btn:hover {
    background-color: #eb2525;
  }
  
  .info {
    text-align: left;
    margin-bottom: 20px;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  .label {
    font-weight: bold;
    color: #333;
    margin-top: 10px;
    font-family: 'Bebas Neue', sans-serif;
    font-weight: bold;  
  }
  
  .value {
    margin-bottom: 8px;
    color: #555;
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .save-btn,
  .cancel-btn {
    padding: 10px 20px;
    border-radius: 20px;
    border: none;
    font-weight: bold;
    cursor: pointer;
  }
  
  .save-btn {
    background-color: #10b981;
    color: white;
  }
  
  .save-btn:disabled {
    background-color: #a7f3d0;
    cursor: not-allowed;
  }
  
  .cancel-btn {
    background-color: #d1d5db;
    color: #333;
    cursor: not-allowed;
    transition: background-color 0.3s ease;
  }
  
  .cancel-btn.active {
    background-color: #ef4444;
    color: white;
    cursor: pointer;
  }
  
  .cancel-btn.active:hover {
    background-color: #dc2626;
  }


  /* header*/

  .page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  width: 48px;
  height: 48px;
  margin-top: 9px;
  margin-right: 14px;
}                                               

.page-title {
  font-size: 36px;
  font-weight: bold;
  margin: 0;
  text-align: center;
  flex: 1;
  font-family: 'Bebas Neue', sans-serif;
  color: black;
  
}

.header-left,
.header-right {
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button-img {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-left: 5px;
}

.back-button-img:hover {
  transform: scale(1.1);
}

  </style>
  