<script setup>
import {ref, onMounted} from "vue";
import router from "../router";
import CardMovie from '@/components/CardMovie.vue';
import MovieDetail from '@/views/MovieDetail.vue'

const data = ref('');

const AuthenticationRequest = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch("http://localhost:8000/api/movies", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const jsonData = await response.json();
      if (jsonData.code === 401){
        await router.push("/login");
        console.log("Vous n'êtes pas connecté");
      }
      data.value = jsonData['hydra:member'];
    } catch (error) {
      console.log(error);
    }
  }else {
    console.log("Vous n'êtes pas connecté");
  }
}

onMounted(async () => {
  await AuthenticationRequest();
});

</script>

<template>
  <div class="container mt-5">
    <h1>Films</h1>
    <div class="my-5">
      <div class="row my-5">
        <div class="col">
          <CardMovie v-for="movie in data" :key="movie.id" :movie="movie"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>