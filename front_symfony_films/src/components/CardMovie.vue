<template>
  <div>
    <div class="card mb-4">
      <div class="card-body">
        <h4 class="card-title">{{ movie.title }}</h4>
        <p class="card-text">{{ truncateText(movie.description, 150) }}</p>
        <p class="card-text fst-italic">
          <strong>Date de sortie:</strong> {{ movie && formatReleaseDate(movie.release_date) }}
        </p>
        <div class="d-flex justify-content-between align-items-center">
          <router-link :to="{ name: 'MovieDetail', params: { id: movie && movie.id }}" class="btn btn-info btn-sm">En savoir plus</router-link>
          <div class="d-flex">
            <button type="button" class="btn btn-warning btn-sm ms-2" @click="toggleDetails(movie.id)">Modifier</button>
            <button type="button" class="btn btn-danger btn-sm ms-2" @click="openDeleteModal(movie.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-3 card p-5 border-warning bg-light my-4" v-if="selectedMovie">
      <h2>{{ selectedMovie.title }}</h2>
      <form @submit.prevent="updateMovie">
        <div class="form-group mt-4">
          <label for="editMovieTitle">Titre du film :</label>
          <input type="text" class="form-control mt-1" id="editMovieTitle" v-model="selectedMovie.title" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieDescription">Description :</label>
          <textarea class="form-control mt-1" id="editMovieDescription" v-model="selectedMovie.description" rows="6"></textarea>
        </div>
        <div class="form-group mt-4">
          <label for="editMovieReleaseDate">Date de sortie :</label>
          <input type="date" class="form-control mt-1" id="editMovieReleaseDate" v-model="selectedMovie.release_date" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieDuration">Durée :</label>
          <input type="number" class="form-control mt-1" id="editMovieDuration" v-model="selectedMovie.duration" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieEntries">Nombre d'entrées :</label>
          <input type="number" class="form-control mt-1" id="editMovieEntries" v-model="selectedMovie.entries" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieBudget">Budget :</label>
          <input type="number" class="form-control mt-1" id="editMovieBudget" v-model="selectedMovie.budget" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieWebsite">Site web :</label>
          <input type="text" class="form-control mt-1" id="editMovieWebsite" v-model="selectedMovie.website" />
        </div>
        <div class="form-group mt-4">
          <label for="editMoviePoster">URL de l'affiche :</label>
          <input type="text" class="form-control mt-1" id="editMoviePoster" v-model="selectedMovie.poster" />
        </div>
        <div class="form-group mt-4">
          <label for="editMovieDirector">Réalisateur :</label>
          <input type="text" class="form-control mt-1" id="editMovieDirector" v-model="selectedMovie.director" />
        </div>
        <div class="my-3 mt-3">
          <button type="submit" class="btn btn-primary">Modifier</button>
          <button type="button" class="btn btn-secondary ms-2" @click="closeForm">Fermer</button>
        </div>
      </form>
    </div>

    <div class="modal fade" id="updateSuccessModal" tabindex="-1" aria-labelledby="updateSuccessModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="updateSuccessModalLabel">Mise à jour réussie</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Le film a été mis à jour avec succès !
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteSuccessModal" tabindex="-1" aria-labelledby="deleteSuccessModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteSuccessModalLabel">Suppression réussie</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {{ deleteSuccess ? 'Le film a été supprimé avec succès !' :'Le film a été supprimé avec succès '}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';

const { movie, movies } = defineProps(['movie', 'movies']);
const selectedMovieId = ref(null);
const selectedMovie = ref(null);
const deleteSuccess = ref(false);

const toggleDetails = (id) => {
  selectedMovieId.value = id;
  selectedMovie.value = movies.find((movie) => movie.id === id);
};

const updateMovie = async () => {
  const token = localStorage.getItem('token');
  if (token && selectedMovie.value) {
    try {
      const response = await fetch(`http://localhost:8000/api/movies/${selectedMovieId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedMovie.value),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du film.');
      }

      const updateSuccessModal = new bootstrap.Modal(document.getElementById('updateSuccessModal'));
      updateSuccessModal.show();

      const updatedMovie = await response.json();
      const movieIndex = movies.findIndex((movie) => movie.id === selectedMovieId.value);
      movies[movieIndex] = updatedMovie;

      selectedMovieId.value = null;
      selectedMovie.value = null;
    } catch (error) {
      console.error(error.message);
    }
  }
};

const openDeleteModal = (id) => {
  console.log('Open Delete Modal called');
  selectedMovieId.value = id;
  const deleteSuccessModal = new bootstrap.Modal(document.getElementById('deleteSuccessModal'));
  deleteSuccessModal.show();

  // Appel à deleteMovie après 3 secondes
  setTimeout(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && selectedMovieId.value) {
        const response = await fetch(`http://localhost:8000/api/movies/${selectedMovieId.value}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          deleteSuccess.value = true;
          window.location.reload();
        } else {
          deleteSuccess.value = false;
        }
      }
    } catch (error) {
      console.error(error.message);
      deleteSuccess.value = false;
    }
  }, 1000);
};

const closeForm = () => {
  selectedMovieId.value = null;
  selectedMovie.value = null;
};

onMounted(() => {
  selectedMovieId.value = null;
  selectedMovie.value = null;
});

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
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
  font-size: 20px;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
}

.card-text {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-info,
.btn-warning,
.btn-danger,
.btn-info:hover,
.btn-warning:hover,
.btn-danger:hover {
  font-size: 12px;
  padding: 6px 12px;
}

/* Ajoutez des styles supplémentaires au besoin */
</style>
