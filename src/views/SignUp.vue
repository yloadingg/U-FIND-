<template>
  
    <div class="background-decor-grid">
  <img
    v-for="n in 60"
    :key="n"
    src="@/assets/images/magnifier.png"
    class="grid-item"
  />
</div>

      <!-- Top Logo -->
  
      <!-- Main Container -->
      <div class="container">
        <!-- Left Section - Sign Up Form -->
        <div class="left-section animate-zoom">
          <div class="form-wrapper">
            <h1>Create Account</h1>
            <form @submit.prevent="handleSubmit">
              <label for="mobile">Username</label>
              <input type="text" id="username" v-model="username" required />
  
              <label for="email">Email Address</label>
              <input type="email" id="email" v-model="email" required />
  
              <label for="password">Password</label>
              <div class="password-wrapper">
                <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required />
                <span class="toggle-password" @click="togglePassword">👁️</span>
              </div>
  
              <button type="submit" class="signup-btn">SIGN UP</button>
            </form>
  
            <p>Already have an account?</p>
            <!-- Back to Sign-In -->
            <router-link to="/login">
              <button class="signin-btn">LOG IN</button>
            </router-link>
          </div>
        </div>
  
           <!-- Right: Image Section -->
           <div class="right-section animate-zoom">
        <img src="@/assets/images/DEC.png" alt="Detective Illustration" class="illustration" />
      </div>
    </div>
 


  </template>
  

  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        showPassword: false
      };
    },
  
    mounted() {
      this.animate = true;
    },
  
    methods: {
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
  
      async handleSubmit() {
        const user = {
          username: this.username,
          email: this.email,
          password: this.password,
        };
  
        try {
          const response = await axios.post('http://localhost:3000/api/auth/signup', user);
          console.log(response.data); // ✅ Success
          alert('Sign Up Successful!');
        } catch (error) {
          console.error('Error:', error);
          alert('Sign Up Failed. Try again!');
        }
      }
    }
  };
  </script>
  
  
  <style scoped>
:global(body) {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: white;
}

/* Top Brand Section */
.Ulogo-container {
  display: flex;
  align-items: center;
  padding: 11.5px 20px;
  position: relative; /* 👈 Add this */
  z-index: 1;         /* 👈 Add this */
}

.Ulogo {
  width: 50px;
  height: 50px;
  margin-right: 5px;
}

.brand-name {
  font-size: 25px;
  font-family: 'Barriecito', cursive;
  color: black;
  font-weight:600
}

/* Main Layout */
.container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative; /* 👈 Add this */
  z-index: 1;         /* 👈 Add this */
}

/* Left Section */
.left-section {
  flex: 1;
  color: rgb(0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 40px;
}

h1 {
  font-size: 42px;
  margin-bottom: 20px;
  font-family: 'Bebas Neue', sans-serif;
  border-radius: 12px;
  padding: 1px 5px 0px;
  background-color: rgb(255, 255, 255);
  display: flex; 
  width: fit-content; 

}

form {
  display: flex;
  flex-direction: column;
  color: black;
}

label {
  margin-top: 10px;
  margin-bottom: 4px;
  font-weight: bold;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  padding: 10px;
  font-size: 16px;
  border: 2px solid #000000; /* light border for visibility */
  background-color: white; /* ensures it stands out on black */
  color: black; /* readable text color */
  border-radius: 6px;
  width: 100%;
  

}

.password-wrapper {
  position: relative;
  margin-bottom: 10px;
}

.password-wrapper input {
  width: 100%;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 11px;
  cursor: pointer;
  color: rgb(0, 0, 0);
}

/* Buttons */
.signup-btn {
  background-color: #0033cc;
  color: white;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  margin-top: 15px;
  transition: all 0.3s ease;
  width: 100%;
}

.signup-btn:hover {
  background-color: #001f99;
  transform: scale(1.05);
  filter: drop-shadow(1px 1px 7px rgb(22, 25, 238));
}

.signin-btn {
  background-color: red;
  color: white;
  margin-top: 10px;
  padding: 12px;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  width: 100%;
  transition: all 0.3s ease;
}

.signin-btn:hover {
  background-color: #cc0000;
  transform: scale(1.05);
  filter: drop-shadow(1px 1px 7px rgb(212, 31, 31));
}

p {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
  color: rgb(0, 0, 0);
}

/* Right side (image) */
.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

}

.illustration {
  max-width: 58%;
  height: auto;
  padding-left: 20px;
}



/* Keyframe animation for floating effect */
@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
}

@keyframes zoomIn {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-zoom {
  animation: zoomIn 0.5s ease-out;
}


/* Positioning for each individual megaphone */
/* Polka dot grid layout using absolute positioning */

.background-decor-grid {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(6, 11fr);
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
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

  </style>
  