<script setup>
import { ref, reactive, provide } from 'vue'

const messages = ref([]);
const conversations = ref([]);
const selectedConversation = ref(null);
const selectedConversationId = ref(null);
const updatedConversation = ref(null);

</script>

<template>
    <slot></slot>
</template>