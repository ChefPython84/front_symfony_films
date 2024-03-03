<script setup>
import {ref, onMounted} from "vue";
import router from "../router";
import CardMovie from '@/components/CardMovie.vue';

const movie = ref('');
const searchInput = ref('');
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
      movie.value = jsonData['hydra:member'];
    } catch (error) {
      console.log(error);
    }
  }else {
    console.log("Vous n'êtes pas connecté");
  }
}
async function search() {
  console.log(searchInput);
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch("http://localhost:8000/api/movies?title=" + searchInput.value, {
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
      movie.value = jsonData['hydra:member'];
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
    <form class="d-flex" @submit.prevent="search">
      <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="searchInput">
      <button class="btn btn-outline-success" type="submit">Search</button>
    </form>
    <div class="my-5">
      <div class="row my-5">
        <div class="col">
          <CardMovie v-for="movie in movie" :key="movie.id" :movie="movie"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>