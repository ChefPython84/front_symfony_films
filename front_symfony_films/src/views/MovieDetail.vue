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

const AuthenticationRequest = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const id = useRoute().params.id; // Utilisez directement useRoute() pour récupérer le paramètre
      const response = await fetch(`http://localhost:8000/api/movies/${id}`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const jsonData = await response.json();
      if (jsonData.code === 401) {
        await router.push("/login");
        console.log("Vous n'êtes pas connecté");
      }
      movieData.value = jsonData;
      console.log(jsonData);
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
  <div class="container mt-5">
    <p></p>
    <div v-if="movieData">
      <h1>{{ movieData.title }}</h1>
      <div class="card">
        <div class="card-body">
          <p class="card-text fw-light">{{}}</p>
          <p class="card-text">{{ movieData.description }}</p>
          <p class="card-text">{{ movieData.director }}</p>
          <p class="card-text">{{ movieData.entries }}</p>
          <p class="card-text">{{ movieData.budget }}</p>
          <p class="card-text">{{ movieData.website }}</p>
          <p class="card-text">{{ movieData.releaseDate }}</p>
          <p class="card-text">{{ movieData.duration }} min</p>
          <h4>Acteurs</h4>
          <div class="card-text">
            <p v-for="actor in movieData.actors" :key="actor.id" class="card-text">
              {{ actor.firstName }} {{ actor.lastName }}<br>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
