<template>
  <div class="page-bookings">
    <h2>Your Bookings</h2>
    <div v-if="bookings.length" class="bookings-grid">
      <div v-for="booking in bookings" :key="booking.id" class="booking-item">
        <h3>{{ booking.camping.name }}</h3>
        <p>{{ booking.camping.description }}</p>
        <p><strong>Booking Dates:</strong> {{ formatDate(booking.start) }} - {{ formatDate(booking.end) }}</p>
        <p><strong>Price:</strong> ${{ booking.camping.pricePerNight }} per night</p>
      </div>
    </div>
    <div v-else>
      <p>No bookings found.</p>
    </div>
  </div>
</template>

<script>
import { getToken, getUser } from "@/services/userService";

export default {
  name: "PageBookings",
  data() {
    return {
      bookings: [],
      currentUser: getUser()
    };
  },
  watch: {
    currentUser(newUser) {
      if (newUser) {
        this.fetchBookings();
      }
    }
  },
  methods: {
    async fetchBookings() {
      const token = getToken();
      const user = getUser();
      console.log("token")
      console.log(token);
      console.log("user");
      console.log(user);
      if (token && user) {
        try {
          const response = await fetch('https://localhost:7232/api/Camp', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const camps = await response.json();
          console.log(camps);
          const userBookings = [];
          for (const camp of camps) {
            console.log("camp");
            console.log(camp);
            for (const booking of camp.bookings) {
              console.log("booking");
              console.log(booking);
              if (booking.user.id === user.id) {
                userBookings.push({
                  ...booking,
                  start: new Date(booking.start),
                  end: new Date(booking.end),
                  camping: {
                    name: camp.name,
                    description: camp.description,
                    pricePerNight: camp.pricePerNight,
                    country: camp.country,
                  }
                });
              }
            }
          }
          this.bookings = userBookings;
          console.log("userBookings");
          console.log(userBookings);
        } catch (error) {
          console.error("There was an error fetching the bookings:", error);
        }
      } else {
        this.$emit("navigate-to-login");
      }
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  },
  mounted() {
    console.log("mounted pagebookings");
    this.fetchBookings();
  },
};
</script>

<style scoped>
.page-bookings {
  padding: 20px;
}

.bookings-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Optional: Adds space between items */
}

.booking-item {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  flex: 1 1 calc(33.333% - 40px); /* Adjust the width to have 3 per row */
  box-sizing: border-box;
}

.booking-item h3 {
  margin: 0 0 10px;
}
</style>
