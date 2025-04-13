<template>
  <div>
    <div class="Ulogo-container">
      <img src="@/assets/images/web-app-manifest-192x192.png" alt="U FIND logo" class="Ulogo" />
      <span class="brand-name">U FIND</span>
    </div>

    <div class="container">
      <!-- Left: Form Section -->
      <div class="left-section">
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
      </div>

      <!-- Right: Image Section -->
      <div class="right-section">
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
/* Logo */
.Ulogo-container {
  display: flex;
  align-items: center;
  padding: 10px 20px;
}

.Ulogo {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}

.brand-name {
  font-size: 30px;
  font-family: 'Barriecito', cursive;
  color: black;
}

/* Layout */
.container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Left side (form) */
.left-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: black;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
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
  padding-top: 10px;
}

/* Form styling */
form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
  font-weight: bold;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  padding: 10px;
  font-size: 16px;
  border: 3px solid #ccc; /* light border for visibility */
  background-color: white; /* ensures it stands out on black */
  color: black; /* readable text color */
  border-radius: 6px;
  width: 100%;
}

/* Password field with toggle */
.password-wrapper {
  position: relative;
  padding-bottom: 10px;
}

.password-wrapper input {
  width: 100%;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 30%;
  cursor: pointer;
}

/* Buttons */
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

.signin-btn {
  background-color: #e60000;
  color: white;
  width: 100%;
  margin-top: 10px;
  padding-bottom: 10px;
}

.signin-btn:hover {
  background-color: #cc0000;
  transform: scale(1.05);
}

.signup-btn {
  margin-top: 10px;
  background-color: #0033cc;
  color: white;
  width: 100%;
}

.signup-btn:hover {
  background-color: #001f99;
  transform: scale(1.05);
}

/* Right side (image) */
.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

}

.illustration {
  max-width: 60%;
  height: auto;
}

/* Optional background decor */
.background-decor img {
  position: absolute;
  width: 40px;
  opacity: 0.2;
}


:global(body) {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #fff;
  overflow: hidden;
}
</style>
