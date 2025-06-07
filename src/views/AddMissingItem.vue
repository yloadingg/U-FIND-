<template>
  <div class="report-lost-container">
    <div class="header-section">
      <img src="@/assets/images/DEC.png" alt="Logo" class="logo" />

      <img
        src="@/assets/images/return.png"
        alt="Back"
        class="back-button"
        @click="goBack"
      />

      <h1 class="report-title">REPORT LOST ITEM</h1>
    </div>

    <div
      class="upload-box"
      :class="{ 'with-image': previewImage }"
      @click="handleUploadClick"
    >
      <div class="plus-icon" v-if="!previewImage">+</div>
      <img v-else :src="previewImage" alt="Preview" class="preview-image" />
      <button
        v-if="previewImage"
        class="remove-image"
        @click.stop="removeImage"
        title="Remove image"
      >
        ×
      </button>
    </div>

    <input
  type="file"
  ref="fileInput"
  accept="image/*"
  @change="handleFileChange"
  style="display: none;"
/>

<form class="lost-form" @submit.prevent="submitForm">
  <input
    type="text"
    v-model="description"
    placeholder="DESCRIPTION"
    class="input-field"
  />
  
  <select v-model="category" class="input-field">
    <option value="" disabled>Select Category</option>
    <option value="Gadgets">Gadgets</option>
    <option value="Papers">Papers</option>
    <option value="Personal Belongings">Personal Belongings</option>
    <option value="Shoes">Shoes</option>
    <option value="Clothes">Clothes</option>
    <option value="Bags">Bags</option>
    <option value="Keys">Keys</option>
    <option value="Wallets">Wallets</option>
    <option value="Others">Others</option>
  
  </select>
  
  <input
    type="datetime-local"
    v-model="dateLost"
    class="input-field"
  />
  <input
    type="text"
    v-model="location"
    placeholder="ROOM/FACILITY NUMBER"
    class="input-field"
  />


      <div class="button-group">
        <button class="submit-button" type="submit">SUBMIT</button>
        <button class="clear-button" type="button" @click="clearForm">CLEAR</button>
      </div>
    </form>
  </div>
</template>

  
<script>
export default {
  data() {
  return {
    previewImage: null,
    description: '',
    category: '', // ✅ Added category
    dateLost: '',
    location: '',
    userId: null,
  };
},
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user.id; // ✅ Set userId from localStorage
    }
  },
  methods: {
    handleUploadClick() {
      if (!this.previewImage) {
        this.$refs.fileInput.click();
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.previewImage = URL.createObjectURL(file);
      } else {
        alert("Please select a valid image file.");
      }
    },
    removeImage() {
      this.previewImage = null;
      this.$refs.fileInput.value = null;
    },
    goBack() {
      this.$router.push('/dashboard');
    },
    clearForm() {
      this.description = '';
      this.dateLost = '';
      this.location = '';
      this.removeImage();
    },
    submitForm() {
      if (!this.previewImage || !this.description || !this.dateLost || !this.location || !this.category) {
  alert("Please fill out all fields and upload an image.");
  return;
}

      const file = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append("image", file);
      formData.append("description", this.description);
      formData.append("category", this.category);
      formData.append("dateLost", this.dateLost);
      formData.append("location", this.location);
      formData.append("userId", this.userId); // ✅ Attach userId

      const token = localStorage.getItem('token'); // ✅ Get token

      fetch("http://localhost:3000/api/lost-items", {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}` // ✅ Send token
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Upload failed");
          return res.json();
        })
        .then(() => {
          alert("Lost item reported!");
          this.clearForm();
          this.$router.push("/lost");
        })
        .catch(err => {
          console.error('Submit error:', err);
          alert("Something went wrong: " + err.message);
        });
    }
  }
};
</script>

  <style scoped>
  .report-lost-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5 rem;
    position: relative;
    background: white;
    min-height: 100vh;
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
  
  .report-title {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 1.3rem;
    color: black;
    font-family: 'Bebas Neue', sans-serif;

  }
  
  .upload-box {
  width: 380px;
  height: 220px;
  border-radius: 30px;
  background-color: #f0f0f0; /* Fallback color */
  filter: drop-shadow(1px 1px 5px rgb(0, 0, 0));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.upload-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/photo.png'); /* Vue's way to handle assets */
  background-size: cover;
  filter: blur(5px);
  z-index: -1;
}

.upload-box:hover {
    transform: scale(1.02);
    filter: drop-shadow(1px 1px 7px rgb(0, 0, 0));
    transition: all .4s;
  }


  .plus-icon {
    width: 60px;
    height: 60px;
    background: black;
    border-radius: 50%;
    color: white;
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .plus-icon:hover {
    transform: scale(1.05);
    filter: drop-shadow(1px 1px 7px rgb(0, 0, 0));
  }
  
  .preview-image {
    width: 100%;
    height: 100%;
    border-radius: 30px;
    object-fit: cover;
  }
  
  .remove-image {
    position: absolute;
    top: 8px;
    right: 12px;
    background: rgba(0, 0, 0, 0.6);
    border: none;
    color: white;
    font-size: 1.5rem;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  
  .upload-box:hover .remove-image {
    display: flex;
  }
  
  .lost-form {
    display: flex;
    flex-direction: column;
    width: 400px;
    gap: 1.5rem;
  }
  
  .input-field {
    border: none;
    border-bottom: 1px solid black;
    font-weight: bolder;
    text-align: center;
    font-size: 1rem;
    padding: 0.5rem 0;
  }
  
  .input-field::placeholder {
    font-family: Arial, Helvetica, sans-serif;
  }
  
  .button-group {
    display: flex;
    gap: 2rem;
  }
  
  .submit-button,
  .clear-button {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 25px;
    font-weight: bold;
    font-size: 1rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .submit-button {
  margin-top: 10px;
  background-color: #0033cc;
  color: white;
  width: 100%;
  }
  
  .clear-button {
  background-color: #e60000;
  color: white;
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
  }

  .clear-button:hover{

  background-color: #cc0000;
  transform: scale(1.05);
  filter: drop-shadow(1px 1px 7px rgb(212, 31, 31));
  }

  .submit-button:hover{
  background-color: #001f99;
  transform: scale(1.05);
  filter: drop-shadow(1px 1px 7px rgb(22, 25, 238));
  }

  </style>
  