<script setup>
import { ref, onMounted, defineProps } from "vue";
import router from "../router";

const { id } = defineProps(["id"]);
const actorData = ref(null);

const AuthenticationRequest = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(`http://localhost:8000/api/actors/${id}`, {
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
      actorData.value = jsonData;
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
    <div v-if="actorData" class="movie-details">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-4">{{ actorData.firstName }} {{ actorData.lastName }}</h1>
        <router-link to="/ActorView" class="btn btn-primary btn-back">Retour aux acteurs</router-link>
      </div>
      <div class="card shadow">
        <div class="card-body p-5">
          <div class="row">
            <div class="col-md-6">
              <img :src="actorData.image"  class="img-fluid rounded shadow" />
            </div>
            <div class="col-md-6">
              <ul class="list-unstyled movie-info">
                <li v-if="actorData.nationality?.name">
                  <strong>Nationalité :</strong> {{ actorData.nationality.name }}
                </li>
                <li><strong>Nombre de Reward :</strong> {{ actorData.reward }}</li>
              </ul>
            </div>
          </div>
          <h4 class="mt-4">Films</h4>
          <div class="row actor-list">
            <div v-for="movie in actorData.movies" :key="movie.id" class="col-md-4 mb-3">
              <div class="card bg-light">
                <div class="card-body">
                  <h5 class="card-title">{{ movie.title }}</h5>
                  <p class="card-text">{{ movie.description }}</p>
                  <router-link :to="{ name: 'MovieDetail', params: { id: movie.id } }" class="btn btn-primary">Voir le film</router-link>
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
  background-color: #6c757d;
  border-color: #6c757d;
  font-size: 0.8em;
  padding: 6px 10px;
}

.shadow {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>





