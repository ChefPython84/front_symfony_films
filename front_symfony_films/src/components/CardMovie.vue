<template>
  <div class="card w-100 mb-4">
    <div class="card-body">
      <h4 class="card-title">{{ movie.title }}</h4>
      <p class="card-text">{{ truncateText(movie.description, 150) }}</p>
      <p class="card-text fst-italic"><strong>Date de sortie:</strong> {{ formatReleaseDate(movie.release_date) }}</p>
      <router-link :to="{ name: 'MovieDetail', params: { id: movie.id }}" class="btn btn-primary">En savoir plus</router-link>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

const formatReleaseDate = (releaseDate) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(releaseDate).toLocaleDateString('fr-FR', options);
};
</script>

<style scoped>

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
  width: 100%;
}

.card:hover {
  transform: scale(1.02);
}

.card-body {
  padding: 10px;
}

.card-title {
  font-size: 25px;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
}

.card-text {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

