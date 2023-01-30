<script setup>
import { ref, onMounted, inject, computed } from "vue";
import { useConversationStore } from "../../stores/ConversationStore";
import RoomCard from "../../components/admin/RoomCard.vue";
import UserLogic from "../../logics/UserLogic";
import LocalStorage from "../../services/LocalStorage";
import CommunicationRequestLogic from "../../logics/CommunicationRequestLogic";
import moment from "moment";

const users = inject("ProviderUsers");
const conversationsStore = useConversationStore();
const rooms = computed(() => conversationsStore.getterRooms);
const isEditing = ref(false);
const current_room = ref(null);
const updateUserStatus = inject("ProviderUpdateUser");
const User = LocalStorage.get("user");
const requestsPending = ref([]);

const changeIsEditing = () => (isEditing.value = !isEditing.value);

const fetchAddRoom = async (room) => {
	await conversationsStore.createRoom(room);
};

const fetchDeleteRoom = async (id) => {
	await conversationsStore.deleteConversation(id);
	rooms.value = rooms.value.filter((r) => r.id !== id);
};

const editRoom = (room) => {
	current_room.value = room;
	isEditing.value = true;
};

const fetchUpdateRoom = async (room, id) => {
	await conversationsStore.updateRoom(room, id).then((result) => {
		rooms.value = rooms.value.map((r) => {
			if (r.id === result.id) {
				return result;
			}

			return r;
		});
	});
};

const onClickAddRoom = () => {
	current_room.value = { name: "", maxParticipants: 0 };
	changeIsEditing();
};

const getRequestsPending = async () => {
	const requests = await CommunicationRequestLogic.getCommunicationRequests();
	requestsPending.value = requests.filter((r) => r.status === "pending");
};

const onClickAcceptRequest = async (id) => {
	await CommunicationRequestLogic.updateCommunicationRequest(id, {
		status: "accepted",
	});
	await getRequestsPending();
};

const onClickRejectRequest = async (id) => {
	await CommunicationRequestLogic.updateCommunicationRequest(id, {
		status: "rejected",
	});
	await getRequestsPending();
};


onMounted(async () => {
	UserLogic.getUsers().then(
		(data) => (users.value = data.filter((u) => u.id !== User.id))
		);
		
		UserLogic.getUser(User.id).then((data) => {
			me.value = data;
			status.value = data.status;
		});
		
		await getRequestsPending();
	});
	
	const me = ref(null);
	const status = ref(null);

	const colorStatus = computed(() => {
		if (status.value === 1) {
			updateUserStatus(me.value.id, { status: 1 });
		return "bg-green-500";
	}

	if (status.value === 0) {
		updateUserStatus(me.value.id, { status: 0 });
		return "bg-red-500";
	}

	return "bg-yellow-500";
});
const fullName = (id) => {
	const user = users.value.find((u) => u.id === id);

	return user ? user.firstName + " " + user.lastName : "";
};

const changeStatus = () => {
	if (status.value === 1) {
		status.value = 0;
	} else {
		status.value = 1;
	}
};

</script>

<template>
	<div class="container w-full mx-auto pt-20">
		<div class="flex justify-end">
			<div class="flex flex-col items-end">
				<div class="mb-2">
					<button
						@click="changeStatus"
						class="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
					>
						Changer de statut
					</button>
				</div>
				<div>
					<span>Disponibilité pour les clients</span>
					<span
						:class="colorStatus"
						class="ml-3 rounded-full w-3 h-3 inline-block"
					></span>
				</div>
			</div>
		</div>
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
									{{requestsPending ? requestsPending.length : 0}}
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
							<h5 class="font-bold uppercase text-gray-600">Utilisateurs</h5>
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
								<h5 class="font-bold uppercase text-gray-600">Salons</h5>
							</div>
							<div>
								<font-awesome-icon
									icon="circle-plus"
									style="cursor: pointer"
									@click="onClickAddRoom"
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
				<div class="w-full md:w-1/2 p-3">
					<div class="bg-white border rounded shadow">
						<div class="border-b p-3 flex justify-between">
							<div>
								<h5 class="font-bold uppercase text-gray-600">Demande de communication</h5>
							</div>
							<div>
								<font-awesome-icon
									icon="circle-plus"
									style="cursor: pointer"
									@click="onClickAddRoom"
								/>
							</div>
						</div>
						<div class="p-5">
							<table class="w-full p-5 text-gray-700">
								<thead>
									<tr>
										<th class="text-left text-blue-900">Utilisateur</th>
										<th class="text-left text-blue-900">Date</th>
										<th class="text-left text-blue-900">Message</th>
										
									</tr>
								</thead>
								<tbody>
									<tr v-for="request in requestsPending" :key="requestsPending.id">
										<td>{{ fullName(request.clientId)}}</td>
										<td>{{ moment(request.createdAt).startOf('minute').fromNow() }}</td>
										<td>{{ request.message.substring(0, 30) }}...</td>
										
										<td>
											<font-awesome-icon
												icon="check"
												style="color: blue; cursor: pointer"
												@click="onClickAcceptRequest(request.id)"
											/>
											<font-awesome-icon
												icon="xmark"
												style="
													color: #d71a1a;
													margin-left: 5px;
													cursor: pointer;
												"
												@click="onClickRejectRequest(request.id)"
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
