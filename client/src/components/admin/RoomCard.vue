<script setup>
import { defineProps, reactive } from "vue";

const props = defineProps({
	room: {
		type: Object,
		required: false,
	},
	addRoom: {
		type: Function,
		required: false,
	},
	changeIsEditing: {
		type: Function,
		required: false,
	},
	editRoom: {
		type: Function,
		required: false,
	},
});

const form = reactive({
	name: props.room.name,
	maxParticipants: props.room.maxParticipants,
});

const submit = (e) => {
	e.preventDefault();

	if (props.room.id) {
		props.editRoom({ form, id: props.room.id });
	} else {
		props.addRoom(form);
	}

	form.name = "";
	form.maxParticipants = 0;
	props.changeIsEditing();
};
</script>

<template>
	<div class="w-full max-w-xl">
		<form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
			<div class="mb-4">
				<h1 class="text-center text-2xl font-bold text-gray-700">
					{{
						form.name === "" && form.maxParticipants === 0
							? "Création"
							: "Édition"
					}}
					d'un salon de discussion
				</h1>

				<label class="block text-gray-700 text-sm font-bold mb-2" for="name">
					Nom
				</label>
				<input
					v-model="form.name"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					id="name"
					type="text"
					placeholder="Nom"
				/>
			</div>
			<div class="mb-6">
				<label
					class="block text-gray-700 text-sm font-bold mb-2"
					for="capacite"
				>
					Capacité
				</label>
				<input
					v-model="form.maxParticipants"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
					id="capacite"
					type="number"
					placeholder="Capacité"
				/>
			</div>
			<div class="flex items-center justify-between">
				<button
					@click="submit"
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					type="button"
				>
					{{
						form.name === "" && form.maxParticipants === 0 ? "Créer" : "Éditer"
					}}
				</button>
			</div>
		</form>
	</div>
</template>

<style scoped></style>
