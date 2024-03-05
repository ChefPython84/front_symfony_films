<script setup>
import { ref, onMounted, defineProps } from "vue";
import router from "../router";

const { id } = defineProps(["id"]);
const userData = ref(null);

const AuthenticationRequest = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
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
      userData.value = jsonData;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("Vous n'êtes pas connecté");
  }
};

onMounted(async () => {
  await AuthenticationRequest();
});
</script>

<template>
  <div class="container my-5">
    <div v-if="userData" class="movie-details">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-4">{{ userData.username }}</h1>
        <router-link to="/UserView" class="btn btn-primary btn-back">Retour aux utilisateurs</router-link>
      </div>
      <div class="card shadow">
        <div class="card-body p-5">
          <div class="row">
            <div class="col-md-6">
              <img :src="userData.image"  class="img-fluid rounded shadow" />
            </div>
            <div class="col-md-6">
              <ul class="list-unstyled movie-info">
                <li><strong>Pseudo</strong> {{ userData.username }}</li>
              </ul>
              <ul class="list-unstyled movie-info">
                <li><strong>Email</strong> :{{ userData.email }}</li>
              </ul>
              <ul class="list-unstyled movie-info">
                <li><strong>Roles</strong> :{{ userData.roles }}</li>
              </ul>
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





