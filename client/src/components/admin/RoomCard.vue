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
		props.editRoom({ ...form }, props.room.id);
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
			<div class="mb-4 input">
				<h1 class="text-center text-2xl font-bold mb-2">
					{{
						form.name === "" && form.maxParticipants === 0
							? "Création"
							: "Édition"
					}}
					d'un salon de discussion
				</h1>
				<label class="block font-bold mb-2" for="name"> Nom </label>
				<input
					v-model="form.name"
					class="appearance-none rounded w-full py-2 px-3 leading-tight focus:outline-none"
					id="name"
					type="text"
					placeholder="Nom"
				/>
			</div>
			<div class="mb-6 input">
				<label class="block font-bold mb-2" for="capacite"> Capacité </label>
				<input
					v-model="form.maxParticipants"
					class="appearance-none rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none"
					id="capacite"
					type="number"
					placeholder="Capacité"
				/>
			</div>
			<div class="flex items-center justify-between">
				<button
					@click="submit"
					class="creation py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

<style scoped>
.creation {
	padding: 5px;
	border-radius: 2px;
	border: 1px solid;
	color: black;
	margin-top: 10px;
	cursor: pointer;
	background-color: #f2f2f2;
	width: 100px;
}

.mb-2 {
	margin-bottom: 20px;
}

.creation:hover {
	opacity: 0.8;
}

.input input {
	border: 1px solid black;
}
</style>
