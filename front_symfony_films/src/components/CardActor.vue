<template>
  <div>
    <div class="card mb-4">
      <div class="card-body">
        <h4 class="card-title">{{ actor.lastName }} {{ actor.firstName }}</h4>
        <p class="card-text">{{  }}</p>
        <p class="card-text fst-italic">
          <strong>Reward</strong> {{ actor.reward }}
        </p>
        <div class="d-flex justify-content-between align-items-center">
          <router-link :to="{ name: 'ActorDetail', params: { id: actor && actor.id }}" class="btn btn-info btn-sm">En savoir plus</router-link>
          <div class="d-flex">
            <button type="button" class="btn btn-warning btn-sm ms-2" @click="toggleDetails(actor.id)">Modifier</button>
            <button type="button" class="btn btn-danger btn-sm ms-2" @click="openDeleteModal(actor.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3 card p-5 border-warning bg-light my-4" v-if="selectedActor">
      <h2>{{ selectedActor.lastName }} {{ selectedActor.firstName }}</h2>
      <form @submit.prevent="updateActor">
        <div class="form-group mt-4">
          <label for="editActorLastName">Nom de l'acteur</label>
          <input type="text" class="form-control mt-1" id="editActorLastName" v-model="selectedActor.lastName" />
        </div>
        <div class="form-group mt-4">
          <label for="editActorFirstName">Prénom de l'acteur</label>
          <input type="text" class="form-control mt-1" id="editActorFirstName" v-model="selectedActor.firstName" />
        </div>
        <div class="form-group mt-4">
          <label for="editActorReward">Nombre de Reward</label>
          <input type="text" class="form-control mt-1" id="editActorReward" v-model="selectedActor.reward" />
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
            L'acteur a été mis à jour avec succès !
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
            {{ deleteSuccess ? 'L\'acteur a été supprimé avec succès !' : 'L\'acteur a été supprimé avec succès ' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';

const { actor, actors } = defineProps(['actor', 'actors']);
const selectedActorId = ref(null);
const selectedActor = ref(null);
const deleteSuccess = ref(false);

const toggleDetails = (id) => {
  selectedActorId.value = id;
  selectedActor.value = actors.find((actor) => actor.id === id);
};

const updateActor = async () => {
  const token = localStorage.getItem('token');
  if (token && selectedActor.value) {
    try {
      const response = await fetch(`http://localhost:8000/api/actors/${selectedActorId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: selectedActor.value.firstName,
          lastName: selectedActor.value.lastName,
          reward: selectedActor.value.reward,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erreur lors de la modification de l\'acteur:', responseData);
        throw new Error('Erreur lors de la modification de l\'acteur');
      }

      const updateSuccessModal = new bootstrap.Modal(document.getElementById('updateSuccessModal'));
      updateSuccessModal.show();

      const actorIndex = actors.findIndex((actor) => actor.id === selectedActorId.value);
      // eslint-disable-next-line vue/no-mutating-props
      actors[actorIndex] = responseData;

      selectedActorId.value = null;
      selectedActor.value = null;
    } catch (error) {
      console.error(error.message);
    }
  }
};
const openDeleteModal = (id) => {
  console.log('Open Delete Modal called');
  selectedActorId.value = id;
  const deleteSuccessModal = new bootstrap.Modal(document.getElementById('deleteSuccessModal'));
  deleteSuccessModal.show();
  setTimeout(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && selectedActorId.value) {
        const response = await fetch(`http://localhost:8000/api/actors/${selectedActorId.value}`, {
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
  selectedActorId.value = null;
  selectedActor.value = null;
};

onMounted(() => {
  selectedActorId.value = null;
  selectedActor.value = null;
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
