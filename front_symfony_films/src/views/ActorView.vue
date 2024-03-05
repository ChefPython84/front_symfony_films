<template>
  <div class="container mt-5">
    <h1 class="text-center">Acteurs</h1>
    <form class="d-flex mb-4">
      <div class="input-group">
        <input class="form-control" type="search" placeholder="Recherche du nom de l'acteur" aria-label="Recherche" v-model="searchInput" @input="autoSearch" />
        <button class="btn btn-outline-success" type="submit">Rechercher</button>
      </div>
    </form>
    <button class="btn btn-primary mt-2 mb-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFomMovie" aria-expanded="false" aria-controls="collapseExample">
      Ajouter un acteur
    </button>
    <div class="collapse mb-4 mx-5" id="collapseFomMovie">
      <div class="card card-body mx-5">
        <form @submit.prevent="addActor" class="mb-2 p-2">
          <h2 class="text-center my-4">Remplir les informations du nouvel acteur</h2>
          <div class="form-group mt-2">
            <label for="first_name">Prénom de l'acteur</label>
            <input type="text" class="form-control mt-1" v-model="newActor.firstName" required />
          </div>
          <div class="form-group mt-2">
            <label for="last_name">Nom de l'acteur</label>
            <input type="text" class="form-control mt-1" v-model="newActor.lastName" required />
          </div>
          <div class="form-group mt-2">
            <label for="reward">Nombre de Reward</label>
            <input type="text" class="form-control mt-1" v-model="newActor.reward" required />
          </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary mt-4">Ajouter</button>
              </div>
        </form>
      </div>
    </div>
    <div class="row" v-if="paginatedActors.length > 0">
      <div class="col-md-6" v-for="actor in paginatedActors" :key="actor.id">
        <CardActor :actor="actor" :actors="actors" />
      </div>
    </div>
    <div v-else>
      <p class="text-center">Acteur non trouvé</p>
    </div>
    <nav aria-label="Page navigation">
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
    <div v-if="showSuccessModal" class="modal" id="successModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Succès!</h5>
            <button type="button" class="close" @click="closeModal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Ajouté avec succès!
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import router from "../router";
import CardActor from "@/components/CardActor.vue";

const actors = ref([]);
const searchInput = ref("");
const itemsPerPage = ref(200);
const currentPage = ref(1);
const totalPages = ref(0);
const startIndex = (currentPage.value - 1) * itemsPerPage.value;
const endIndex = startIndex + itemsPerPage.value;
const paginatedActors = ref([]);

const showSuccessModal = ref(false);

const newActor = ref({
  firstName: "",
  lastName: "",
  reward: "",
});

const addActor = async () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const response = await fetch('http://localhost:8000/api/actors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: newActor.value.firstName,
          lastName: newActor.value.lastName,
          reward: newActor.value.reward,
        }),
      });

      const jsonData = await response.json();

      if (jsonData.code === 401) {
        await router.push('/login');
        console.log('Vous n\'êtes pas connecté');
      }

      console.log('Acteur ajouté avec succès!');
      newActor.value = {
        firstName: '',
        lastName: '',
        reward: '',
      };

      showSuccessModal.value = true;

    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'acteur:', error);
    }
  } else {
    console.log('Vous n\'êtes pas connecté');
  }
};

const closeModal = () => {
  showSuccessModal.value = false;
};

const AuthenticationRequest = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/actors?page=${currentPage.value}&itemsPerPage=${itemsPerPage.value}`,
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
      actors.value = jsonData["hydra:member"];
      totalPages.value = jsonData["hydra:view"]["hydra:last"].split("=")[1];
      updatePagination();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Vous n'êtes pas connecté");
  }
};


const search = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/actors?lastName=${searchInput.value}`,
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
      actors.value = jsonData["hydra:member"];
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

const changePage = async (offset) => {
  const newPage = currentPage.value + offset;
  if (newPage >= 1 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    await AuthenticationRequest();
  }
};

const updatePagination = () => {
  paginatedActors.value = actors.value.slice(startIndex, endIndex);
  totalPages.value = Math.ceil(actors.value.length / itemsPerPage.value);
};

onMounted(async () => {
  await AuthenticationRequest();
});
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
