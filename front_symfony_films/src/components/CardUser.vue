<template>
  <div>
    <div class="card mb-4">
      <div class="card-body">
        <h4 class="card-title">{{ user.username }}</h4>
        <p class="card-text">{{ user.email }}</p>
        <p class="card-text fst-italic">
          <strong>Roles :</strong> {{ user.roles }}
        </p>
        <div class="d-flex justify-content-between align-items-center">
          <router-link :to="{ name: 'UserDetail', params: { id: user && user.id }}" class="btn btn-info btn-sm">En savoir plus</router-link>
          <div class="d-flex">
            <button type="button" class="btn btn-warning btn-sm ms-2" @click="toggleDetails(user.id)">Modifier</button>
            <button type="button" class="btn btn-danger btn-sm ms-2" @click="openDeleteModal(user.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3 card p-5 border-warning bg-light my-4" v-if="selectedUser">
      <h2>{{ selectedUser.name }}</h2>
      <form @submit.prevent="updateUser">
        <div class="form-group mt-4">
          <label for="editUserName">Pseudo de l'utilisateur</label>
          <input type="text" class="form-control mt-1" id="editUserName" placeholder="jean" v-model="selectedUser.name" />
        </div>
        <div class="form-group mt-4">
          <label for="editUserEmail">Email de l'acteur</label>
          <input type="email" class="form-control mt-1" id="editUserEmail" placeholder="exemple@exemple.com" v-model="selectedUser.email" />
        </div>
        <div class="form-group mt-4">
          <label for="editUserPassword">Mot de passe</label>
          <span class="text-muted"> (Le mot de passe doit avoir sept caractères ou plus et contenir au moins une lettre majuscule et une lettre minuscule)</span>
          <input type="password" class="form-control mt-1" id="editUserPassword" placeholder="password" v-model="selectedUser.password" />
        </div>
        <div class="form-group mt-4">
          <label for="editUserRoles">Roles</label>
          <select class="form-select mt-1" id="editUserRoles" v-model="selectedUser.roles" multiple>
            <option value="ROLE_USER">Utilisateur</option>
            <option value="ROLE_ADMIN">Administrateur</option>
          </select>
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
            L'utilisateur a été mis à jour avec succès !
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
            {{ deleteSuccess ? 'L\'utilisateur a été supprimé avec succès !' : 'L\'utilisateur a été supprimé avec succès ' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';

const { user, users } = defineProps(['user', 'users']);
const selectedUserId = ref(null);
const selectedUser = ref(null);
const deleteSuccess = ref(false);

const toggleDetails = (id) => {
  selectedUserId.value = id;
  selectedUser.value = users.find((user) => user.id === id);
};

const updateUser = async () => {
  const token = localStorage.getItem('token');
  if (token && selectedUser.value) {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${selectedUserId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: selectedUser.value.username,
          email: selectedUser.value.email,
          password: selectedUser.value.password,
          roles: [selectedUser.value.roles],
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erreur lors de la modification de l\'utilisateur:', responseData);
        throw new Error('Erreur lors de la modification de l\'utilisateur');
      }

      const updateSuccessModal = new bootstrap.Modal(document.getElementById('updateSuccessModal'));
      updateSuccessModal.show();

      const userIndex = users.findIndex((user) => user.id === selectedUserId.value);
      users[userIndex] = responseData;

      selectedUserId.value = null;
      selectedUser.value = null;
    } catch (error) {
      console.error(error.message);
    }
  }
};
const openDeleteModal = (id) => {
  console.log('Open Delete Modal called');
  selectedUserId.value = id;
  const deleteSuccessModal = new bootstrap.Modal(document.getElementById('deleteSuccessModal'));
  deleteSuccessModal.show();
  setTimeout(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && selectedUserId.value) {
        const response = await fetch(`http://localhost:8000/api/users/${selectedUserId.value}`, {
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
  selectedUserId.value = null;
  selectedUser.value = null;
};

onMounted(() => {
  selectedUserId.value = null;
  selectedUser.value = null;
});
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
</style>
