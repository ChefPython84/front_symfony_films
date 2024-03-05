<script setup>
import Logout from '@/components/security/Logout.vue'
</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-info">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/"><span class="fw-bold text-white">Movie-Hub</span></router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/MovieView">Films</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ActorView">Acteurs</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/CategoryView">Catégories</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link nav-link-profile" to="/UserView">Profil</router-link>
          </li>
          <li class="nav-item">
            <Logout />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

.nav-link-profile {
  color: #fff;
  font-size: 1.2rem;
  margin: 0 1rem;
}

.nav-link-profile:hover {
  color: #e6e6e6;
}
.navbar {
  padding: 1rem 2rem;
  background-color: #1e90ff; /* Utilisation de la couleur blue d'Allociné */
}

.navbar-brand {
  font-size: 1.5rem;
}

.navbar-toggler {
  border: none;
}

.nav-link {
  color: #fff;
  font-size: 1.2rem;
  margin: 0 1rem;
}

.nav-link:hover {
  color: #e6e6e6;
}

.container-fluid {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
}
</style>
