<script setup>
import { ref, onMounted, defineProps } from "vue";
import { useRoute } from "vue-router";
import router from "../router";

defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const movieData = ref(null);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const AuthenticationRequest = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const id = useRoute().params.id;
      const response = await fetch(`http://localhost:8000/api/movies/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const jsonData = await response.json();
      if (jsonData.code === 401) {
        await router.push("/login");
        console.log("Vous n'êtes pas connecté");
      }
      movieData.value = jsonData;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("Vous n'êtes pas connecté");
  }
};

onMounted(async () => {
  await AuthenticationRequest();
});
</script>
<template>
  <div class="container my-5">
    <div v-if="movieData" class="movie-details">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-4">{{ movieData.title }}</h1>
        <router-link to="/MovieView" class="btn btn-primary btn-back">Retour aux films</router-link>
      </div>
      <div class="card shadow">
        <div class="card-body p-5">
          <div class="row">
            <div class="col-md-6">
              <img :src="movieData.image" class="img-fluid rounded shadow" />
            </div>
            <div class="col-md-6">
              <ul class="list-unstyled movie-info">
                <li v-if="movieData.Category?.name">
                  <strong>Catégorie:</strong> {{ movieData.Category?.name }}
                </li>
                <li><strong>Réalisateur:</strong> {{ movieData.director }}</li>
                <li><strong>Date de sortie:</strong> {{ formatDate(movieData.release_date) }}</li>
                <li><strong>Durée:</strong> {{ movieData.duration }} min</li>
                <li><strong>Nombre d'entrées:</strong> {{ movieData.entries }}</li>
                <li><strong>Budget:</strong> {{ movieData.budget }} €</li>
                <li><strong>Site web:</strong> {{ movieData.website }}</li>
              </ul>
              <p class="lead">{{ movieData.description }}</p>
            </div>
          </div>
          <h4 class="mt-4">Acteurs</h4>
          <div class="row actor-list">
            <div v-for="actor in movieData.actors" :key="actor.id" class="col-md-4 mb-3">
              <div class="card bg-light">
                <div class="card-body">
                  <h5 class="card-title">{{ actor.firstName }} {{ actor.lastName }}</h5>
                  <router-link to="/ActorDetail" class="btn btn-primary">Voir plus</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
}

.movie-details {
  width: 100%;
}

.card {
  margin-top: 20px;
  border: none;
}

.card-body {
  border-radius: 15px;
}

.list-unstyled {
  list-style: none;
  padding: 0;
}

.movie-info {
  padding-left: 0;
}

.actor-list {
  padding: 0;
}

.display-4 {
  font-size: 2.5em;
  font-weight: bold;
}

.lead {
  font-size: 1.2em;
}

.list-unstyled li {
  font-size: 1.2em;
  margin-bottom: 10px;
}
.img-fluid {
  max-width: 100%;
  height: auto;
}

.btn-primary {
  font-size: 1em;
  padding: 8px 12px;
}

.btn-back {
  background-color: #6c757d; /* Gris */
  border-color: #6c757d;
  font-size: 0.8em;
  padding: 6px 10px;
}

.shadow {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>





