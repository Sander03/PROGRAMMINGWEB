<template>
  <div class="settings-page">
    <h2>Settings</h2>
    <form @submit.prevent="updateSettings">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" v-model="user.name" id="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="user.email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="user.password" id="password" placeholder="Leave blank to keep current password" />
      </div>
      <button type="submit" class="save-button">Save Changes</button>
    </form>
  </div>
</template>

<script>
import {getToken, getUser} from "@/services/userService";

export default {
  name: 'PageSettings',
  emits: ['userUpdated'],

  data() {
    return {
      user: {
        name: getUser().name,
        email: getUser().email,
        password: undefined
      }
    };
  },
  methods: {
    async updateSettings() {
      try {
        const token = getToken();
        const updatedUser = {
          name: this.user.name,
          email: this.user.email,
        };
        if (this.user.password) {
          updatedUser.password = this.user.password;
        }

        console.log('Updating user with data:', updatedUser); // Debug log
        const response = await fetch('https://localhost:7232/api/User', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`
          },
          body: JSON.stringify(updatedUser)
        });
        if (response.ok) {
          this.$emit('userUpdated');

        } else {
          const errorData = await response.json();
          console.error('Error updating settings:', errorData);
          alert(`Error updating settings: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error updating settings:', error);
        alert('There was an error updating your settings. Please try again.');
      }
    }
  }
};

</script>

<style scoped>
.settings-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.save-button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.save-button:hover {
  background-color: #2c3e50;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.save-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.4);
}
</style>
