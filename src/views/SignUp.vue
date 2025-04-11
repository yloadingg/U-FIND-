<template>
    <div>
      <!-- Top Logo -->
      <div class="Ulogo-container">
        <img src="@/assets/images/web-app-manifest-192x192.png" alt="U FIND logo" class="Ulogo" />
        <span class="brand-name">U FIND</span>
      </div>
  
      <!-- Main Container -->
      <div class="container">
        <!-- Left Section - Sign Up Form -->
        <div class="left-section">
          <div class="form-wrapper">
            <h1>Create Account</h1>
            <form @submit.prevent="handleSubmit">
              <label for="mobile">Mobile Number</label>
              <input type="text" id="mobile" v-model="mobile" required />
  
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
              <button class="signin-btn">SIGN IN</button>
            </router-link>
          </div>
        </div>
  
        <!-- Right Section - Illustration -->
        <div class="right-section">
          <div class="image-wrapper">
            <img src="@/assets/images/DEC.png" alt="Detective Illustration" class="illustration" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SignUp',
    data() {
      return {
        mobile: '',
        email: '',
        password: '',
        showPassword: false,
      };
    },
    methods: {
      handleSubmit() {
        console.log('Mobile:', this.mobile, 'Email:', this.email, 'Password:', this.password);
        // Add the logic to handle form submission (e.g., API call)
      },
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
    },
  };
  </script>
  
  <style scoped>
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    overflow: hidden;
  }
  
  /* logo brand name */
  .Ulogo-container {
    display: flex;
    align-items: center;
  }
  
  .Ulogo {
    padding-top: 10px;
    padding-left: 10px;
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }
  
  .brand-name {
    font-size: 30px;
    padding-top: 8px;
    font-family: 'Barriecito', cursive;
  }
  
  /* Form */
  .container {
    display: flex;
    height: 100vh; /* full viewport height */
    width: 1000px;
    justify-content: space-between; /* space between the form and the image */
  }
  
  .form-wrapper {
    flex: 1;
    padding: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 150px;
    padding-bottom: 200px;
  }
  
  h1 {
    font-size: 42px;
    margin-bottom: 20px;
    font-family: 'Bebas Neue', sans-serif;
  }
  
  p {
    text-align: center;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  form {
    display: flex;
    flex-direction: column;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  label {
    margin-top: 10px;
    font-weight: bold;
  }
  
  input[type="email"],
  input[type="password"],
  input[type="text"] {
    padding: 10px;
    margin-top: 5px;
    font-size: 16px;
  }
  
  .password-wrapper {
    position: relative;
    padding-bottom: 20px;
  }
  
  .password-wrapper input {
    width: 94%;
  }
  
  .toggle-password {
    position: absolute;
    right: 5px;
    top: 25%;
    cursor: pointer;
  }
  
  .image-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .illustration {
    width: 100%;
    max-width: 400px;
  }
  
  .signin-btn,
  .signup-btn {
    border: none;
    padding: 12px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  /* Sign In Button */
  .signin-btn {
    background-color: #e60000;
    color: white;
  }
  
  .signin-btn:hover {
    background-color: #cc0000;
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
  
  /* Sign Up Button */
  .signup-btn {
    margin-top: 10px;
    background-color: #0033cc;
    color: white;
    width: 100%;
    max-width: 400px;
  }
  
  .signup-btn:hover {
    background-color: #001f99;
    transform: scale(1.05);
    box-shadow: 12 6px 12px rgba(0, 0, 0, 0.2);
  }
  
  .right-section {
    flex: 1;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .illustration {
    width: 110%;
    padding-left: 230px;
    padding-top: 10px;
    padding-bottom: 100px;
  }
  </style>
  