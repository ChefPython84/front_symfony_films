<script setup>
import { ref, onMounted } from "vue";
import router from "../router";
import CardMovie  from '@/components/CardMovie.vue';
import CardActor from '@/components/CardActor.vue'

const data_movie = ref(null);
const data_actors = ref(null);


const AuthenticationRequest = async () => {
  const token = localStorage.getItem('token');
  if (!token){
    await router.push("/login");
  }else {
    try {
      const response_movie = await fetch("http://localhost:8000/api/movies", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const response_actors = await fetch("http://localhost:8000/api/actors", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const jsonData_movie = await response_movie.json();
      const jsonData_actors = await response_actors.json();
      if (jsonData_movie.code === 401){
        await router.push("/login");
        console.log("Vous n'êtes pas connecté");
      }
      data_movie.value = jsonData_movie['hydra:member'].slice(0, 4);
      data_actors.value = jsonData_actors['hydra:member'].slice(0, 4)
    } catch (error) {
      console.log(error);
    }
  }
};


onMounted(async () => {
  await AuthenticationRequest();
});

</script>

<template>
  <main>
    <div class="container my-5">
      <h1 class="text-center mb-4 display-4">Bienvenue sur notre plateforme</h1>
      <div class="my-5">
        <h2 class="mb-4 display-5">Les derniers films</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
          <div class="col" v-for="movie in data_movie" :key="movie.id">
            <CardMovie :movie="movie" />
          </div>
        </div>
      </div>
      <hr class="border-bottom my-4">
      <div class="my-5">
        <h2 class="mb-4 display-5">Les derniers acteurs</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
          <div class="col" v-for="actor in data_actors" :key="actor.id">
            <CardActor :actor="actor" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.display-4, .display-5 {
  color: #28a745;
}
.border-bottom {
  border-width: 2px;
}
.text-center {
  text-align: center;
}
</style>

