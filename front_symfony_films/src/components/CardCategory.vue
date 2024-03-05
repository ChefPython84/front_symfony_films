<template>
  <div>
    <div class="card mb-4">
      <div class="card-body">
        <h4 class="card-title">{{ category.name }}</h4>
        <p class="card-text">{{  }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <router-link :to="{ name: 'CategoryDetail', params: { id: category && category.id }}" class="btn btn-info btn-sm">En savoir plus</router-link>
          <div class="d-flex">
            <button type="button" class="btn btn-warning btn-sm ms-2" @click="toggleDetails(category.id)">Modifier</button>
            <button type="button" class="btn btn-danger btn-sm ms-2" @click="openDeleteModal(category.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-3 card p-5 border-warning bg-light my-4" v-if="selectedCategory">
      <h2>{{ selectedCategory.name }}</h2>
      <form @submit.prevent="updatedCategory">
        <div class="form-group mt-4">
          <label for="editCategoryName">Nom de la categorie</label>
          <input type="text" class="form-control mt-1" id="editCategoryName" v-model="selectedCategory.name" />
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
            La catégorie a été mis à jour avec succès !
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
            {{ deleteSuccess ? 'La catégorie a été supprimé avec succès !' : 'La catégorie a été supprimé avec succès ' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';

const { category, categories } = defineProps(['category', 'categories']);
const selectedCategoryId = ref(null);
const selectedCategory = ref(null);
const deleteSuccess = ref(false);

const toggleDetails = (id) => {
  selectedCategoryId.value = id;
  selectedCategory.value = categories.find((category) => category.id === id);
};

const updatedCategory = async () => {
  const token = localStorage.getItem('token');
  if (token && selectedCategory.value) {
    try {
      const response = await fetch(`http://localhost:8000/api/categories/${selectedCategoryId.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: selectedCategory.value.name,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erreur lors de la modification de la catégorie:', responseData);
        throw new Error('Erreur lors de la modification de la catégorie');
      }

      const updateSuccessModal = new bootstrap.Modal(document.getElementById('updateSuccessModal'));
      updateSuccessModal.show();

      const categoryIndex = categories.findIndex((category) => category.id === selectedCategoryId.value);
      // eslint-disable-next-line vue/no-mutating-props
      categories[categoryIndex] = responseData;

      selectedCategoryId.value = null;
      selectedCategory.value = null;
    } catch (error) {
      console.error(error.message);
    }
  }
};
const openDeleteModal = (id) => {
  console.log('Open Delete Modal called');
  selectedCategoryId.value = id;
  const deleteSuccessModal = new bootstrap.Modal(document.getElementById('deleteSuccessModal'));
  deleteSuccessModal.show();
  setTimeout(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && selectedCategoryId.value) {
        const response = await fetch(`http://localhost:8000/api/categories/${selectedCategoryId.value}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Delete response:', response);

        if (response.ok) {
          deleteSuccess.value = true;
          window.location.reload();
        } else {
          deleteSuccess.value = false;
        }
      }
    } catch (error) {
      console.error('Delete error:', error.message);
      deleteSuccess.value = false;
    }
  }, 1000);
};

const closeForm = () => {
  selectedCategoryId.value = null;
  selectedCategory.value = null;
};

onMounted(() => {
  selectedCategoryId.value = null;
  selectedCategory.value = null;
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
