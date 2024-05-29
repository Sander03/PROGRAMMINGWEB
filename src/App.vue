<template>
  <div id="app">
    <nav class="navbar">
      <ul class="nav-list">
        <li
            v-for="page in pages"
            :key="page"
            @click="setActivePage(page)"
            :class="{ active: activePage === page }"
        >
          {{ page }}
        </li>
        <li v-if="isLoggedIn" @click="logout">Logout</li>
      </ul>
    </nav>
    <div class="content">
      <h1 v-if="activePage !== 'Camping Spots'">{{ activePage }}</h1>
      <PageHome v-if="activePage === 'Home'" :isLoggedIn="isLoggedIn" @discoverSites="handleDiscoverSites" @navigate="setActivePage" />
      <PageCampingSpots v-if="activePage === 'Camping Spots'" @add-spot="handleAddSpot" />
      <PageRegister v-if="activePage === 'Register'" @registrationSuccess="handleRegistrationSuccess" />
      <PageLogin v-if="activePage === 'Log in'" @loginSuccess="handleLoginSuccess" :set-active-page="setActivePage" />
      <PageSettings v-if="activePage === 'Settings'" @userUpdated="handleUserUpdated" />
      <PageBookings v-if="activePage === 'Bookings'" />
      <PageOwnedSpots v-if="activePage === 'Owned Spots'" />
    </div>
  </div>
</template>

<script>
import PageHome from './components/PageHome.vue';
import PageCampingSpots from './components/PageCampingSpots.vue';
import PageRegister from './components/PageRegister.vue';
import PageLogin from './components/PageLogin.vue';
import PageSettings from './components/PageSettings.vue';
import PageBookings from './components/PageBookings.vue';
import PageOwnedSpots from './components/PageOwnedSpots.vue';
import { getToken, logoutUser } from "@/services/userService";

const homePage = "Home";
const campingSpotsPage = "Camping Spots";
const loginPage = "Log in";
const registerPage = "Register";
const settingsPage = "Settings";
const bookingsPage = "Bookings";
const ownedSpotsPage = "Owned Spots";

export default {
  name: 'App',
  components: {
    PageHome,
    PageCampingSpots,
    PageRegister,
    PageLogin,
    PageSettings,
    PageBookings,
    PageOwnedSpots
  },
  data() {
    return {
      activePage: homePage,
      isLoggedIn: false,
    };
  },
  methods: {
    logout() {
      logoutUser();
      this.isLoggedIn = false;
      this.setActivePage(loginPage);
      location.reload();
    },
    setActivePage(page) {
      this.activePage = page;
    },
    handleDiscoverSites() {
      if (this.isLoggedIn) {
        this.setActivePage(campingSpotsPage);
      } else {
        this.setActivePage(loginPage);
      }
    },
    handleLoginSuccess() {
      console.log("handleLoginSuccess")
      this.isLoggedIn = true;
      this.setActivePage(homePage);
    },
    handleRegistrationSuccess() {
      console.log("handleRegistrationSuccess")
      this.setActivePage(loginPage);
    },
    handleUserUpdated() {
      console.log("handleUserUpdated")
      this.logout();
      this.setActivePage(homePage);
    },
    handleAddSpot() {
      console.log("Add spot clicked from PageCampingSpots");
    }
  },
  created() {
    const token = getToken();
    this.isLoggedIn = token !== undefined && token !== null;
    console.log("created() logged in", this.isLoggedIn)
    if (this.isLoggedIn) {
      this.setActivePage(homePage);
    }
  },
  computed: {
    pages() {
      console.log("getting pages")
      console.log("this is logged in", this.isLoggedIn)
      return this.isLoggedIn ? [homePage, campingSpotsPage, bookingsPage, ownedSpotsPage,settingsPage ] : [homePage, campingSpotsPage, registerPage, loginPage];
    }
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

.navbar {
  background-color: #42b983;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-list {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  margin: 0;
}

.nav-list li {
  margin: 0 15px;
  cursor: pointer;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 12px;
  transition: background-color 0.3s, color 0.3s;
  color: white;
}

.nav-list li.active {
  background-color: #2c3e50;
  color: white;
}

.nav-list li:hover {
  background-color: #2c3e50;
  color: white;
}
</style>
