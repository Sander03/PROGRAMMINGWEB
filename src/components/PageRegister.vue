<template>
  <div class="register-container">
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="form.name" placeholder="Enter your name" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="form.email" placeholder="Enter your email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="form.password" placeholder="Enter your password" required>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { post } from "@/services/apiService";

export default {
  name: 'PageRegister',
  emits: ['registrationSuccess'],
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async register() {
      try {
        const payload = {
          id: 0,
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          bookings: [],
          role: 0
        };

        console.log('Payload:', payload);
        await post("User", JSON.stringify(payload));
        this.$emit('registrationSuccess')
        alert('Registration successful');
      } catch (error) {
        console.error('Error:', error);
        alert('Error during registration');
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  max-width: 420px;
  margin: 30px auto;
  background: #f2f2f2;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}

label {
  color: #aaa;
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
}

button:hover {
  opacity: 0.8;
}
</style>
