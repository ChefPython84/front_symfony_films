<template>
  <div class="container mt-5">
    <h1 class="text-center">Films</h1>
    <form class="d-flex mb-4">
      <div class="input-group">
        <input
          class="form-control"
          type="search"
          placeholder="Recherche"
          aria-label="Recherche"
          v-model="searchInput"
          @input="autoSearch"
        />
        <button class="btn btn-outline-success" type="submit">Rechercher</button>
      </div>
    </form>
    <div class="row">
      <div class="col-md-6" v-for="movie in paginatedMovies" :key="movie.id">
        <CardMovie :movie="movie" :movies="movies" />
      </div>
    </div>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a class="page-link" @click="changePage(-1)" :disabled="currentPage === 1" aria-label="Précédent">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item"><a class="page-link">{{ currentPage }} / {{ totalPages }}</a></li>
        <li class="page-item">
          <a class="page-link" @click="changePage(1)" :disabled="currentPage === totalPages" aria-label="Suivant">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "../router";
import CardMovie from "@/components/CardMovie.vue";

const movies = ref([]);
const searchInput = ref("");
const totalPages = ref(0);
const currentPage = ref(1);
const itemsPerPage = 8;
const paginatedMovies = ref([]);

const AuthenticationRequest = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/movies`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonData = await response.json();
      if (jsonData.code === 401) {
        await router.push("/login");
        console.log("Vous n'êtes pas connecté");
      }
      movies.value = jsonData["hydra:member"];
      updatePagination();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Vous n'êtes pas connecté");
  }
};

const autoSearch = async () => {
  if (searchInput.value.trim() !== "") {
    await search();
  } else {
    await AuthenticationRequest();
  }
};

const search = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/movies?title=${searchInput.value}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonData = await response.json();
      if (jsonData.code === 401) {
        await router.push("/login");
        console.log("Vous n'êtes pas connecté");
      }
      movies.value = jsonData["hydra:member"];
      updatePagination();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Vous n'êtes pas connecté");
  }
};

onMounted(async () => {
  await AuthenticationRequest();
});

const changePage = async (offset) => {
  const newPage = currentPage.value + offset;
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    updatePagination();
  }
};

const updatePagination = () => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  paginatedMovies.value = movies.value.slice(startIndex, endIndex);
  totalPages.value = Math.ceil(movies.value.length / itemsPerPage);
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

form {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
}

.form-control {
  flex: 1;
  margin-right: 10px;
}

.btn-outline-success {
  background-color: #28a745;
  color: #fff;
}

.page-item {
  display: inline-block;
  margin-right: 10px;
}

.page-link {
  color: #28a745;
  border-color: #28a745;
}

.page-link:hover {
  background-color: #28a745;
  color: #fff;
  border-color: #28a745;
}
</style>
