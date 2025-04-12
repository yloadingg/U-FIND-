
<template>
    <div>
      <div class="Ulogo-container">
        <img src="@/assets/images/web-app-manifest-192x192.png" alt="U FIND logo" class="Ulogo" />
        <span class="brand-name">U FIND</span>
      </div>
    
      <div class="container">
        <div class="form-wrapper">
          <h1>Welcome Back!</h1>
          <form @submit.prevent="handleLogin">
            <label for="email">Email Address</label>
            <input type="email" id="email" v-model="email" required />
  
            <label for="password">Password</label>
            <div class="password-wrapper">
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required />
              <span class="toggle-password" @click="togglePassword">👁️</span>
            </div>
  
            <button type="submit" class="signin-btn">SIGN IN</button>
          </form>
  
          <p>Didn't have an account?</p>
          <router-link to="/signup">
            <button class="signup-btn">SIGN UP</button>
          </router-link>
        </div>
  
        <div class="image-wrapper">
          <img src="@/assets/images/DEC.png" alt="Detective Illustration" class="illustration" />
        </div>
      </div>
  
      <div class="background-decor">
        <img v-for="n in 20" :key="n" src="@/assets/images/megaphone.png" :class="`decor decor${n}`" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Login",
    data() {
      return {
        email: "",
        password: "",
        showPassword: false,
      };
    },
    methods: {
      handleLogin() {
        console.log("Email:", this.email, "Password:", this.password);
        // Replace with your login logic (e.g. API call)
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
    background-color: blue;
  }
  
  :global(body) {
  background-color: rgb red;
}
  
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
  
  /* Main Layout */
  .container {
    display: flex;
    height: 100vh;
    width: 1000px;
  }
  
  .left-section {
    flex: 1;
    padding: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 150px;
    padding-bottom: 200px;
  }
  
  .logo {
    width: 50px;
    margin-bottom: 10px;
  }
  
  h1 {
    font-size: 42px;
    margin-bottom: 20px;
    font-family: 'Bebas Neue', sans-serif;
  }
  
  /* Paragraph Styling */
  p {
    text-align: center;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  /* Form Styling */
  form {
    display: flex;
    flex-direction: column;
    font-family: Arial, Helvetica, sans-serif;
  }
  
  label {
    margin-top: 10px;
    font-weight: bold;
    
  }
  
  /* Input fields for email, mobile, password */
  input[type="email"],
  input[type="password"],
  input[type="text"] {
    padding: 10px;
    margin-top: 5px;
    font-size: 16px;
  }
  
  /* Password Field Toggle */
  .password-wrapper {
    position: relative;
    padding-bottom: 10px;
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
    width: 100%;
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
  
  /* Right Section with Image */
  .right-section {
    flex: 1;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
   
  }
  
  .illustration {
    width: 100%;
    padding-left: 650px;
    padding-top: 10px;
    padding-bottom: 100px;
    
  }
  
  </style>
  

  