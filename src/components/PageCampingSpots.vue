<template>
  <div class="camping-spots-page">
    <!-- Filters -->
    <div class="filter-sidebar">
      <div class="button-container">
        <button @click="openModal">Add spot</button>
      </div>
      <h2>Filter</h2>
      <div class="filter-group">
        <h3>Price</h3>
        <input type="range" v-model="filters.price" min="0" max="500" step="10"/>
        <span><br>Up to ${{ filters.price }}</span>
      </div>
      <div class="filter-group">
        <h3>Specifications</h3>
        <ul class="specifications-list">
          <li v-for="acc in allowedSpecifications" :key="acc">
            <label>
              <input type="checkbox" v-model="filters.specifications" :value="acc"/>
              {{ acc }}
            </label>
          </li>
        </ul>
      </div>
    </div>

    <!-- Camping Spots-->
    <div class="camping-spots-list">
      <div v-for="spot in filteredCampingSpots" :key="spot.id" class="camping-spot">
        <h3>{{ spot.name }}</h3>
        <p>{{ spot.description }} - ${{ spot.pricePerNight }} per night</p>
        <p>Specifications: {{ spot.specifications.map(spec => spec.specification).join(', ') }}</p>
        <button @click="()=>openBooking(spot.id)">Book</button>
      </div>
    </div>

    <!-- Add Spot Modal -->
    <div class="modal-overlay" v-if="isAddSpotModalVisible">
      <div class="modal">
        <h2>Add New Camping Spot</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" v-model="newSpot.name" required/>
          </div>
          <div class="form-group">
            <label for="description">Description:</label>
            <textarea v-model="newSpot.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="pricePerNight">Price per Night:</label>
            <input type="number" v-model="newSpot.pricePerNight" required/>
          </div>
          <div class="form-group">
            <label for="country">Country:</label>
            <input type="text" v-model="newSpot.country" required/>
          </div>
          <div class="form-group">
            <label for="specifications">Specifications:</label>
            <div class="specifications">
              <select v-model="newSpecification">
                <option value="Tent">Tent</option>
                <option value="RV">RV</option>
                <option value="Camper">Camper</option>
                <option value="Yurt">Yurt</option>
              </select>
              <button type="button" @click="addSpecification">Add</button>
            </div>
            <ul>
              <li v-for="(spec, index) in newSpot.specifications" :key="index">
                {{ spec.specification }}
                <button type="button" @click="removeSpecification(index)">Remove</button>
              </li>
            </ul>
          </div>
          <div class="form-buttons">
            <button type="submit" class="submit-button">Submit</button>
            <button type="button" class="cancel-button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Book Spot Modal -->
    <div class="booking-overlay" v-if="isBookingModalVisible">
      <div class="booking">
        <h2>Book a Camping Spot</h2>
        <DatePicker v-model="bookingDates" range placeholder="Select date range" class="calendar"/>
        <div class="form-buttons">
          <button type="button" class="submit-button-booking" @click="submitBooking">Book</button>
          <button type="button" class="cancel-button-booking" @click="closeBooking">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getToken, getUser} from "@/services/userService";
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import {post} from "@/services/apiService";

export default {
  name: 'PageCampingSpots',
  components: {
    DatePicker
  },
  data() {
    return {
      filters: {
        price: 500,
        location: "",
        specifications: []
      },
      campingSpots: [],
      allowedSpecifications: ['Tent', 'RV', 'Camper', 'Yurt'],
      isAddSpotModalVisible: false,
      isBookingModalVisible: false,
      newSpot: {
        name: '',
        description: '',
        pricePerNight: 0,
        country: '',
        specifications: [],
        bookings: []
      },
      newSpecification: 'Tent',
      bookingDates: [],
      selectedBookingSpotId: undefined
    };
  },
  computed: {
    uniqueLocations() {
      return [...new Set(this.campingSpots.map(spot => spot.location))];
    },
    filteredCampingSpots() {
      return this.campingSpots.filter(spot => {
        return spot.pricePerNight <= this.filters.price &&
            (this.filters.location === '' || spot.location === this.filters.location) &&
            (this.filters.specifications.length === 0 || this.filters.specifications.some(acc => spot.specifications.some(spec => spec.specification === acc)));
      });
    }
  },
  methods: {
    openModal() {
      const token = getToken();
      if (token) {
        this.isAddSpotModalVisible = true;
      } else {
        this.$emit('navigate-to-login');
      }
    },
    openBooking(spotId) {
      const token = getToken();
      if (token) {
        this.isBookingModalVisible = true;
        this.selectedBookingSpotId = spotId;
      }
    },
    closeModal() {
      this.isAddSpotModalVisible = false;
    },
    closeBooking() {
      this.isBookingModalVisible = false;
      this.selectedBookingSpotId = undefined;
    },
    addSpecification() {
      if (this.newSpecification.trim()) {
        this.newSpot.specifications.push({specification: this.newSpecification});
        this.newSpecification = 'Tent'; // Reset to default
      }
    },
    removeSpecification(index) {
      this.newSpot.specifications.splice(index, 1);
    },
    async submitForm() {
      const newSpotWithOwner = {
        ...this.newSpot,
        ownerId: getUser().id
      };

      console.log('Posting data:', newSpotWithOwner);
      try {
        const data = await post("Camp", JSON.stringify(newSpotWithOwner));
        console.log('Response from server:', data); // Log the server's response
        this.campingSpots.push(data);
        this.newSpot = {
          name: '',
          description: '',
          pricePerNight: 0,
          country: '',
          specifications: [],
          bookings: []
        };
        this.closeModal();
        this.fetchCampingSpots(); // Refresh the camping spots list

      } catch (error) {
        console.error('There was an error adding the camping spot:', error);
        alert(`There was an error adding the camping spot: ${error.message}`);
      }
    },
    async fetchCampingSpots() {
      try {
        const response = await fetch('https://localhost:7232/api/Camp');
        this.campingSpots = await response.json();
      } catch (error) {
        console.error('There was an error fetching the camping spots:', error);
      }
    },
    async submitBooking() {
      const bookingData = {
        start: this.bookingDates[0],
        end: this.bookingDates[1]
      }
      const response = await post(`Camp/${this.selectedBookingSpotId}/camping`, JSON.stringify(bookingData))
      console.log('Booking Dates:', this.bookingDates);
      console.log(response);
      this.closeBooking();
    },
    async bookCampingSpot() {
      await post("Camp", JSON.stringify({
        email: this.email,
        password: this.password
      }))
    }
  },
  mounted() {
    this.fetchCampingSpots();
  }
};
</script>

<style scoped>
.camping-spots-page {
  display: flex;
}

.filter-sidebar {
  width: 200px;
  padding: 20px;
  border-right: 1px solid #ccc;
}

.filter-group {
  margin-bottom: 20px;
}

/* Enhanced Button container styles */
.button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.button-container button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button-container button:hover {
  background-color: #2c3e50;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.button-container button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.4);
}

.camping-spots-list {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  background-color: #f2f2f2;
}

.camping-spot {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  width: calc(25% - 20px); /* Three spots per row */
  box-sizing: border-box;
}

.camping-spot h3 {
  margin: 0 0 10px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal h2 {
  margin-top: 0;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group textarea {
  resize: vertical;
}

.specifications {
  display: flex;
  align-items: center;
}

.specifications select {
  flex: 1;
}

.specifications button {
  margin-left: 10px;
  padding: 8px 12px;
}

.specifications-list {
  list-style: none;
  padding: 0;
}

.specifications-list li {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.specifications-list label {
  display: flex;
  align-items: center;
  width: 100%;
}

.specifications-list input[type="checkbox"] {
  margin-right: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

ul li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
}

ul li button {
  background: none;
  border: none;
  color: #42b983;
  cursor: pointer;
}

ul li button:hover {
  color: #2c3e50;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
}

.form-buttons button {
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button {
  background-color: #42b983;
  color: white;
}

.submit-button:hover {
  background-color: #2c3e50;
}

.cancel-button {
  background-color: #ccc;
}

.cancel-button:hover {
  background-color: #999;
}

.booking-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.booking {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

</style>
