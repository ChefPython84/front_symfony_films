<script setup>
import { ref, onMounted, defineProps } from "vue";
import { useRoute } from "vue-router";
import router from "../router";

defineProps({
  category: {
    type: Object,
    required: true,
  },
});

const categoryData = ref(null);

const AuthenticationRequest = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const id = useRoute().params.id;
      const response = await fetch(`http://localhost:8000/api/categories/${id}`, {
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
      categoryData.value = jsonData;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("Vous n'êtes pas connecté");
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};


onMounted(async () => {
  await AuthenticationRequest();
});
</script>
<template>
  <div class="container my-5">
    <div v-if="categoryData" class="movie-details">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-4">{{ categoryData.name }}</h1>
        <router-link to="/CategoryView" class="btn btn-primary btn-back">Retour aux catégories</router-link>
      </div>
      <div class="card shadow">
        <div class="card-body p-5">
          <h4 class="mt-4">Films</h4>
          <div class="row actor-list">
            <div v-for="movie in categoryData.movies" :key="movie.id" class="col-md-4 mb-3">
              <div class="card bg-light">
                <div class="card-body">
                  <h5 class="card-title">{{ movie.title}}</h5>
                  <p class="card-text fw-light">Date de sortie : {{ formatDate(movie.release_date) }}</p>
                  <p class="card-text">{{ truncateText(movie.description, 150) }}</p>
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
  background-color: #6c757d;
  border-color: #6c757d;
  font-size: 0.8em;
  padding: 6px 10px;
}

.shadow {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>





