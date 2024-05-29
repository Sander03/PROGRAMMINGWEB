<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" placeholder="Enter your email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password" required>
      </div>
      <button type="submit">Login</button>
    </form>
    <button class="register-button" @click="goToRegister">Create an account</button>
  </div>
</template>

<script>
import {saveUser} from "@/services/userService";
import {post} from "@/services/apiService";

export default {
  name: 'PageLogin',
  emits: ['loginSuccess'],
  props: {
    setActivePage: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const data = await post("User/login", JSON.stringify({
          email: this.email,
          password: this.password
        }));
        const tokenString = `${this.email}:${this.password}`
        const token = btoa(tokenString);

        const userData = {
          id: data.id,
          name: data.name,
          email: data.email,
          token: token,
          role: data.role
        };

        saveUser(userData);
        this.$emit('loginSuccess', userData);
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    },
    goToRegister() {
      this.setActivePage('Register');
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 420px;
  margin: 30px auto;
  background: #f2f2f2;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
label {
  color: #aaaaaaa5;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
input {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}
button {
  width: 100%;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 8px;
}
button:hover {
  opacity: 0.8;
}
.register-button {
  background-color: #f3f3f3;
  color: blue;
  margin-top: 10px;
}
.register-button:hover {
  background-color: #e6e6e6;
}
</style>
