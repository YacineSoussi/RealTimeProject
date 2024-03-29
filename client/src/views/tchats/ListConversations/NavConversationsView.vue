<script setup>
import { inject, onMounted, computed } from "vue";
import moment from "moment";
import ModalRoomsVue from "../../../components/Modal/ModalRooms.vue";
import ModalChatVue from "../../../components/Modal/ModalChat.vue";
import { useConversationStore } from "../../../stores/ConversationStore";

const conversationStore = useConversationStore();
const rooms = computed(() => conversationStore.rooms);
const conversations = computed(() => conversationStore.conversations);
const getConversationOfUser = inject("ProviderGetConversationOfUser");
const selectedConversationId = inject("ProviderSelectedConversationId");
const setSelectedConversationId = conversationStore.setSelectConversationId;
const isOpenModal = inject("ProviderIsOpenModal");
const setIsOpenModal = inject("ProviderSetValueModal");
const isOpenModalChat = inject("ProviderIsOpenModalChat");
const setIsOpenModalChat = inject("ProviderSetValueModalChat");
const User = inject("ProviderUser");
const users = inject("ProviderUsers");

onMounted(() => {
	getConversationOfUser().then(() => {
		if (conversations.length > 0) {
			selectedConversationId.value = conversations[0].id;
		}
	});
});

const getUserOfOtherParticipant = (participants) => {
	const participant = participants.find(
		(participant) => participant.userId !== User.id
	);

	if (participant) {
		return users.value.find((user) => {
			return user.id === participant.userId;
		});
	}
};
</script>

<template>
	<div class="w-1/3 border flex flex-col navConversations">
		<ModalRoomsVue v-if="isOpenModal" :rooms="rooms" />
		<ModalChatVue v-if="isOpenModalChat" :users="users" />
		<div
			class="py-2 px-3 bg-grey-lighter flex flex-row justify-end items-center bloc-heading"
		>
			<div class="flex">
				<div class="ml-4">
					<font-awesome-icon
						@click="setIsOpenModalChat"
						icon="message"
						style="cursor: pointer"
						class="mr-4"
					/>
					<font-awesome-icon
						@click="setIsOpenModal"
						icon="users"
						style="cursor: pointer"
					/>
				</div>
			</div>
		</div>
		<div class="bg-grey-lighter flex-1 overflow-auto">
			<div
				@click="setSelectedConversationId(conversation.id)"
				v-for="conversation in conversations"
				class="px-3 flex items-center bg-grey-light cursor-pointer"
			>
				<div>
					<img
						v-if="conversation.type === 'room'"
						class="h-12 w-12 rounded-full"
						src="/roomLogo.png"
					/>
					<img v-else src="/messengerLogo.png" class="h-12 w-12 rounded-full" />
				</div>
				<div class="ml-4 flex-1 border-b border-grey-lighter py-4">
					<div class="flex items-bottom justify-between">
						<p class="text-grey-darkest">
							{{
								conversation.type === "room"
									? conversation.name
									: getUserOfOtherParticipant(conversation.participants)
											.firstName +
									  " " +
									  getUserOfOtherParticipant(conversation.participants)
											.lastName
							}}
						</p>
						<p class="text-grey-darkest">
							{{
								conversation.lastMessage
									? moment(conversation.lastMessage.updatedAt).format("hh:mm a")
									: ""
							}}
						</p>
					</div>
					<p v-if="conversation.lastMessage" class="text-grey-dark mt-1">
						{{
							conversation.lastMessage.authorId === User.id
								? "Moi : "
								: conversation.lastMessage.author.firstName +
								  " " +
								  conversation.lastMessage.author.lastName +
								  ":  "
						}}
						{{
							conversation.lastMessage ? conversation.lastMessage.content : ""
						}}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.navConversations .searching {
	border: 1px solid black;
	border-radius: 0.25rem;
}

@media (max-width: 800px) {
	.navConversations {
		width: 100%;
		height: 100%;
	}
}

.navConversations .bloc-heading {
	border-bottom: 1px solid #e2e8f0;
}
</style>
