<script setup>
import { ref, inject } from "vue";
import RoomCard from "../../components/admin/RoomCard.vue";

const users = inject("ProviderUsers");
const rooms = inject("ProviderRooms");
const createRoom = inject("ProviderCreateRoom");
const updateRoom = inject("ProviderUpdateConversation");
const deleteRoom = inject("ProviderDeleteConversation");
const isEditing = ref(false);
const current_room = ref(null);

const changeIsEditing = () => {
	isEditing.value = !isEditing.value;
};

const fetchAddRoom = async (room) => {
	await createRoom(room).then((result) => {
		rooms.value.push(result);
	});
};

const fetchDeleteRoom = async (id) => {
	await deleteRoom(id).then(() => {
		rooms.value = rooms.value.filter((r) => r.id !== id);
	});
};

const editRoom = (room) => {
	current_room.value = room;
	isEditing.value = true;
};

const fetchUpdateRoom = async (room) => {
	await updateRoom(room.id, room.form).then((result) => {
		rooms.value = rooms.value.map((r) => {
			if (r.id === result.id) {
				return result;
			}
			return r;
		});
	});
};

// On click of the add room icon
const onAddRoom = () => {
	current_room.value = {
		name: "",
		maxParticipants: 0,
	};
	changeIsEditing();
};
</script>

<template>
	<div class="container w-full mx-auto pt-20">
		<div class="w-full px-4 md:px-0 md:mt-8 mb-16 text-gray-800 leading-normal">
			<div class="flex flex-wrap">
				<div class="w-full md:w-1/2 xl:w-1/3 p-3">
					<div class="bg-white border rounded shadow p-2">
						<div class="flex flex-row items-center">
							<div class="flex-shrink pr-4">
								<div class="rounded p-3 bg-green-600">
									<i class="fa fa-wallet fa-2x fa-fw fa-inverse"></i>
								</div>
							</div>
							<div class="flex-1 text-right md:text-center">
								<h5 class="font-bold uppercase text-gray-500">
									Communications en attente
								</h5>
								<h3 class="font-bold text-3xl">
									$3249
									<span class="text-green-500"
										><i class="fas fa-caret-up"></i
									></span>
								</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="w-full md:w-1/2 xl:w-1/3 p-3">
					<div class="bg-white border rounded shadow p-2">
						<div class="flex flex-row items-center">
							<div class="flex-shrink pr-4">
								<div class="rounded p-3 bg-pink-600">
									<i class="fas fa-users fa-2x fa-fw fa-inverse"></i>
								</div>
							</div>
							<div class="flex-1 text-right md:text-center">
								<h5 class="font-bold uppercase text-gray-500">
									Nombre d'utilisateur(s)
								</h5>
								<h3 class="font-bold text-3xl">
									{{ users ? users.length : null }}
									<span class="text-pink-500"
										><i class="fas fa-exchange-alt"></i
									></span>
								</h3>
							</div>
						</div>
					</div>
				</div>
				<div class="w-full md:w-1/2 xl:w-1/3 p-3">
					<div class="bg-white border rounded shadow p-2">
						<div class="flex flex-row items-center">
							<div class="flex-shrink pr-4">
								<div class="rounded p-3 bg-yellow-600">
									<i class="fas fa-user-plus fa-2x fa-fw fa-inverse"></i>
								</div>
							</div>
							<div class="flex-1 text-right md:text-center">
								<h5 class="font-bold uppercase text-gray-500">
									Nombre de salon(s)
								</h5>
								<h3 class="font-bold text-3xl">
									{{ rooms ? rooms.length : null }}
									<span class="text-yellow-600"
										><i class="fas fa-caret-up"></i
									></span>
								</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
			<hr class="border-b-2 border-gray-400 my-8 mx-4" />
			<div class="flex flex-row flex-wrap flex-grow mt-2">
				<div class="w-full md:w-1/2 p-3">
					<RoomCard
						v-if="isEditing"
						:room="current_room"
						:addRoom="fetchAddRoom"
						:changeIsEditing="changeIsEditing"
						:editRoom="fetchUpdateRoom"
					/>
					<div v-else class="bg-white border rounded shadow">
						<div class="border-b p-3">
							<h5 class="font-bold uppercase text-gray-600">Utilisateur(s)</h5>
						</div>
						<div class="p-5">
							<table class="w-full p-5 text-gray-700">
								<thead>
									<tr>
										<th class="text-left text-blue-900">Nom</th>
										<th class="text-left text-blue-900">Adresse mail</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="user in users" :key="user.id">
										<td>{{ user.firstName + " " + user.lastName }}</td>
										<td>{{ user.email }}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div class="w-full md:w-1/2 p-3">
					<div class="bg-white border rounded shadow">
						<div class="border-b p-3 flex justify-between">
							<div>
								<h5 class="font-bold uppercase text-gray-600">Salon(s)</h5>
							</div>
							<div>
								<font-awesome-icon
									icon="circle-plus"
									style="cursor: pointer"
									@click="onAddRoom"
								/>
							</div>
						</div>
						<div class="p-5">
							<table class="w-full p-5 text-gray-700">
								<thead>
									<tr>
										<th class="text-left text-blue-900">Nom</th>
										<th class="text-left text-blue-900">Capacité</th>
										<th class="text-left text-blue-900">Membre(s)</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="room in rooms" :key="room.id">
										<td>{{ room.name }}</td>
										<td>{{ room.maxParticipants }}</td>
										<td>{{ room.participants.length }}</td>
										<td>
											<font-awesome-icon
												icon="pen-to-square"
												style="color: blue; cursor: pointer"
												@click="editRoom(room)"
											/>
											<font-awesome-icon
												icon="trash"
												style="
													color: #d71a1a;
													margin-left: 5px;
													cursor: pointer;
												"
												@click="fetchDeleteRoom(room.id)"
											/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
