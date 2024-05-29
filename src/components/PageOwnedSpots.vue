<template>
  <div class="page-owned-spots">
    <h2>My Camping Spots</h2>
    <div v-if="spots.length" class="spots-grid">
      <div v-for="spot in spots" :key="spot.id" class="spot-item">
        <h3>{{ spot.name }}</h3>
        <p>{{ spot.description }}</p>
        <p><strong>Price:</strong> ${{ spot.pricePerNight }} per night</p>
        <p><strong>Country:</strong> {{ spot.country }}</p>
      </div>
    </div>
    <div v-else>
      <p>No spots found.</p>
    </div>
  </div>
</template>

<script>
import { getToken, getUser } from "@/services/userService";

export default {
  name: "PageOwnedSpots",
  data() {
    return {
      spots: [],
      currentUser: getUser()
    };
  },
  watch: {
    currentUser(newUser) {
      if (newUser) {
        this.fetchSpots();
      }
    }
  },
  methods: {
    async fetchSpots() {
      const token = getToken();
      const user = getUser();
      if (token && user) {
        try {
          const response = await fetch('https://localhost:7232/api/Camp', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const spots = await response.json();
          this.spots = spots.filter(spot => spot.ownerId === user.id);
        } catch (error) {
          console.error("There was an error fetching the spots:", error);
        }
      } else {
        this.$emit("navigate-to-login");
      }
    }
  },
  mounted() {
    this.fetchSpots();
  },
};
</script>

<style scoped>
.page-owned-spots {
  padding: 20px;
}

.spots-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Optional: Adds space between items */
}

.spot-item {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  flex: 1 1 calc(33.333% - 40px); /* Adjust the width to have 3 per row */
  box-sizing: border-box;
}

.spot-item h3 {
  margin: 0 0 10px;
}
</style>
