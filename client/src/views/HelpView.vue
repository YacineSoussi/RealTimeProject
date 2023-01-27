<script setup>
import { ref } from 'vue';

const message = ref('');
const submitRequest = () => {
  console.log(message.value);
};
</script>

<template>
    <div>
        <!-- contacter  -->
      <form @submit.prevent="submitRequest">
        <label>
          Message:
          <textarea v-model="message"></textarea>
        </label>
        <button type="submit">Envoyer la demande</button>
      </form>
    </div>
  </template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  padding: 20px;
}

label {
  margin-bottom: 10px;
}

textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button[type="submit"]:hover {
  background-color: #3e8e41;
}
</style>