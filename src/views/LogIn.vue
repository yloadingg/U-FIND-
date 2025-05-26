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
 

    <div class="container">
      <!-- Left: Form Section -->
      <div class="left-section">
        <div class="form-wrapper" :class="{ 'zoom-in': animate }">
          <h1>Welcome!</h1>
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
        <img
          src="@/assets/images/DEC.png"
          alt="Detective Illustration"
          class="illustration"
          :class="{ 'zoom-in': animate }"
        />
      </div>
    </div>


    <footer>
  <p>Found it! &copy; 2025 U FIND.</p>
</footer>


</template>


<script>
import axios from 'axios';

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      animate: false,
    };
  },
  mounted() {
    this.animate = true;
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      try {
        const res = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password
        });

        const { token, user, message } = res.data;

        if (token && user) {
          // ✅ Save token and user info
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

          alert(message || 'Login successful');
          this.$router.push('/dashboard'); // ✅ Redirect to dashboard
        } else {
          alert('No token or user data received from server.');
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || 'Login failed. Check your email and password.');
      }
    }
  }
};




</script>

<style scoped>



/* Logo */
.Ulogo-container {
  display: flex;
  align-items: center;
  padding: 10px 20px;
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
/* Layout */
.container {
  display: flex;
  height:100vh;
  width: 100%;
  overflow: hidden;
  position: relative; /* 👈 Add this */
  z-index: 1;         /* 👈 Add this */
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
  border: 2px solid #000000; /* light border for visibility */
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
  top: 20%;
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
  filter: drop-shadow(1px 1px 7px rgb(212, 31, 31));
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
  filter: drop-shadow(1px 1px 7px rgb(22, 25, 238));
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




:global(body) {
  margin: 0;
  font-family: Arial, sans-serif;
  overflow: hidden;

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
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.zoom-in {
  animation: zoomIn 0.6s ease-out forwards;
}

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


footer {
    background-color: #f0f0f0; /* A light grey background */
    color: #333;             /* Darker text color for contrast */
    padding: 20px;           /* Space inside the footer */
    text-align: center;      /* Center the text horizontally */
    font-family: Arial, sans-serif; /* A common, readable font */
    font-size: 14px;         /* Smaller font size for footer text */
    margin-top: 40px;        /* Space above the footer to separate it from content */
}

footer p {
    margin: 0; /* Remove default paragraph margin for cleaner spacing */
}

</style>
