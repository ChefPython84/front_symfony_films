<script setup>
import {defineProps} from 'vue';
// eslint-disable-next-line no-unused-vars
import MovieDetail from '@/views/MovieDetail.vue';

defineProps({
  movie: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="card w-75">
    <div class="card-body">
      <h5 class="card-title">{{movie.title}}</h5>
      <p class="card-text">{{movie.description}}</p>
      <router-link :to="{ name: 'MovieDetail', params: { id : movie.id }}" class="btn btn-primary">En savoir plus</router-link>
    </div>
  </div>


</template>

<style scoped>

</style>
