<template>
  <main>
    <section class="hero">
      <h2>Easily find camping spots</h2>
      <p>Your adventure starts here. Find the best camping spots and unique experiences.</p>
      <button class="get-started" @click="handleGetStarted">Get Started</button>
    </section>

    <section class="features">
      <h3>Why Choose Us?</h3>
      <div class="feature-grid">
        <div class="feature">
          <h4>Beautiful Locations</h4>
          <p>Discover beautiful camping spots around the world.</p>
        </div>
        <div class="feature">
          <h4>Unique Experiences</h4>
          <p>Find unique and unforgettable camping experiences.</p>
        </div>
        <div class="feature">
          <h4>Trusted Hosts</h4>
          <p>Stay with trusted hosts who provide top-notch service.</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'PageHome',
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    handleGetStarted() {
      if (this.isLoggedIn) {
        this.$emit('navigate', 'Camping Spots');
      } else {
        this.$emit('navigate', 'Register');
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
}

header {
  background: #333;
  color: #fff;
  padding: 1rem 0;
}

header nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

header .logo h1 {
  margin: 0;
}

header .nav-links {
  list-style: none;
  display: flex;
}

header .nav-links li {
  margin-left: 2rem;
}

header .nav-links a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
}

header .nav-links a:hover {
  text-decoration: underline;
}

header .nav-links li.active a {
  font-weight: bold;
  text-decoration: underline;
}

.hero {
  background: #f5f5f5;
  color: #333;
  padding: 4rem 1rem;
  text-align: center;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.hero .cta {
  background: #e67e22;
  color: #fff;
  padding: 0.75rem 2rem;
  text-decoration: none;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.hero .cta:hover {
  background: #cf6d17;
}

.features {
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.features h3 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.feature-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.feature {
  flex: 1;
  margin: 1rem;
  padding: 1rem;
  background: #f4f4f4;
  border-radius: 5px;
}

footer {
  background: #333;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
  margin-top: 2rem;
}

.get-started {
  background-color: #42b983;
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.get-started:hover {
  background-color: #2c3e50;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.get-started:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.4);
}
</style>
