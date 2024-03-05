<template xmlns="http://www.w3.org/1999/html">
  <div class="container mt-5">
    <h1 class="text-center">Utilisateurs</h1>
    <form class="d-flex mb-4">
      <div class="input-group">
        <input class="form-control" type="search" placeholder="Recherche du nom de l'utilisateur" aria-label="Recherche" v-model="searchInput" @input="autoSearch" />
        <button class="btn btn-outline-success" type="submit">Rechercher</button>
      </div>
    </form>
    <button class="btn btn-primary mt-2 mb-4" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFomMovie" aria-expanded="false" aria-controls="collapseExample">
      Ajouter un utilisateur
    </button>
    <div class="collapse mb-4 mx-5" id="collapseFomMovie">
      <div class="card card-body mx-5">
        <form @submit.prevent="addUser" class="mb-2 p-2">
          <h2 class="text-center my-4">Remplir les informations du nouvel utilisateur</h2>
          <div class="form-group mt-2">
            <label for="username">Pseudo de l'utilisateur</label>
            <input type="text" class="form-control mt-1" v-model="newUser.username" placeholder="jean" required />
          </div>
          <div class="form-group mt-2">
            <label for="email">Email de l'utilisateur</label>
            <input type="text" class="form-control mt-1" v-model="newUser.email" placeholder="exemple@exemple.com" required />
          </div>
          <div class="form-group mt-2">
            <label for="password">Password</label>
            <span class="text-muted"> (Le mot de passe doit avoir sept caractères ou plus et contenir au moins une lettre majuscule et une lettre minuscule)</span>
            <input type="password" class="form-control mt-1" v-model="newUser.password" placeholder="password" required />
          </div>
          <div class="form-group mt-4">
            <label for="editUserRoles">Roles</label>
            <select class="form-select mt-1" id="editUserRoles" v-model="newUser.roles" multiple>
              <option value="ROLE_USER">Utilisateur</option>
              <option value="ROLE_ADMIN">Administrateur</option>
            </select>
          </div>
            <div class="form-group">
              <button type="submit" class="btn btn-primary mt-4">Ajouter</button>
            </div>
        </form>
      </div>
    </div>
    <div class="row" v-if="users.length > 0">
      <div class="col-md-6" v-for="user in users" :key="user.id">
        <CardUser :user="user" :users="users" />
      </div>
    </div>
    <div v-else>
      <p class="text-center">Utilisateur non trouvé</p>
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
import CardUser from '@/components/CardUser.vue'

const users = ref([]);
const searchInput = ref("");

const showSuccessModal = ref(false);

const newUser = ref({
  username: "",
  email: "",
  password: "",
  roles: [],
});

const addUser = async () => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUser.value.username,
          email: newUser.value.email,
          password: newUser.value.password,
          roles: newUser.value.roles,
        }),
      });

      const jsonData = await response.json();
      console.error('Error adding user:', jsonData);


      if (jsonData.code === 401) {
        await router.push('/login');
        console.log('Vous n\'êtes pas connecté');
      }

      console.log('Utilisateur ajouté avec succès!');
      newUser.value = {
        username: "",
        email: "",
        password: "",
        roles: [],
      };
      window.location.reload();
      showSuccessModal.value = true;

    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
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
  if (!token){
    await router.push("/login");
  }else {
    {
      try {
        const response = await fetch(
          `http://localhost:8000/api/users`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const jsonData = await response.json();
        if (jsonData.code === 401) {
          await router.push("/login");
          console.log("Vous n'êtes pas connecté");
        }
        users.value = jsonData["hydra:member"];
      } catch (error) {
        console.log(error);
      }
    }
  }
};


const search = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/users?username=${searchInput.value}`,
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
      users.value = jsonData["hydra:member"];
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
