<template>
  <div class="container mt-5">
    <h1 class="text-center">Catégories</h1>
    <form class="d-flex mb-4">
      <div class="input-group">
        <input class="form-control" type="search" placeholder="Recherche la catégorie" aria-label="Recherche" v-model="searchInput" @input="autoSearch" />
        <button class="btn btn-outline-success" type="submit">Rechercher</button>
      </div>
    </form>
    <button class="btn btn-primary mt-2 mb-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFomMovie" aria-expanded="false" aria-controls="collapseExample">
      Ajouter une catégorie
    </button>
    <div class="collapse mb-4 mx-5" id="collapseFomMovie">
      <div class="card card-body mx-5">
        <form @submit.prevent="addCategory" class="mb-2 p-2">
          <h2 class="text-center my-4">Remplir la nouvelle catégorie</h2>
          <div class="form-group mt-2">
            <label for="category_name">Nom de la catégorie</label>
            <input type="text" class="form-control mt-1" v-model="newCategory.name" required />
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-primary mt-4">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
    <div class="row" v-if="categories.length > 0">
      <div class="col-md-6" v-for="category in categories" :key="category.id">
        <CardCategory :category="category" :categories="categories" />
      </div>
    </div>
    <div v-else>
      <p class="text-center">Catégorie non trouvée</p>
    </div>
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
import CardCategory from '@/components/CardCategory.vue'

const categories = ref([]);
const searchInput = ref("");
const showSuccessModal = ref(false);
const newCategory = ref({
  name: "",
});

const addCategory = async () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      if (!newCategory.value.name.trim()) {
        console.error("Category name should not be blank.");
        return;
      }
      const response = await fetch('http://localhost:8000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCategory.value.name,
        }),
      });

      const jsonData = await response.json();

      if (jsonData.code === 401) {
        await router.push('/login');
        console.log('Vous n\'êtes pas connecté');
      }

      console.log('Catégorie ajoutée avec succès!');
      newCategory.value = {
        name: "",
      };

      showSuccessModal.value = true;

    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
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
        `http://localhost:8000/api/categories`,
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

      categories.value = jsonData["hydra:member"];
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
        `http://localhost:8000/api/categories?name=${searchInput.value}`,
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
      categories.value = jsonData["hydra:member"];
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
