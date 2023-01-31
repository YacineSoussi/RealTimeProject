<script setup>
import { inject, ref, computed } from "vue";
import moment from "moment";
import InputMessage from "../../../components/Input/InputMessage.vue";
import { useConversationStore } from "../../../stores/ConversationStore";

const conversationStore = useConversationStore();
const User = inject("ProviderUser");
const selectedConversation = computed(
	() => conversationStore.selectedConversation
);
const participantsOFConversation = inject("ProviderParticipantsOFConversation");
const input = ref(null);
const fullName = (authorId) => {
	if (participantsOFConversation.value) {
		const participant = participantsOFConversation.value.find(
			(participant) => participant.user.id === authorId
		);

		if (participant) {
			return participant.user.firstName + " " + participant.user.lastName;
		}
	}
};
</script>

<template>
	<div class="w-2/3 border flex flex-col messagesView">
		<div
			class="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center"
		>
			<div class="flex items-center">
				<div class="ml-4">
					<p v-if="selectedConversation" class="text-grey-darkest">
						{{ selectedConversation.name }}
					</p>
					<p class="text-grey-darker mt-1">
						<template v-if="participantsOFConversation">
							<template v-for="participant in participantsOFConversation">
								{{ fullName(participant.user.id) }},
							</template>
						</template>
					</p>
				</div>
			</div>
		</div>
		<div class="flex-1 overflow-auto" ref="input">
			<div class="py-2 px-3">
				<template v-if="selectedConversation">
					<template v-for="message in selectedConversation.messages">
						<div v-if="message.authorId !== User.id" class="flex mb-2">
							<div class="rounded py-2 px-3" style="background-color: #f2f2f2">
								<p class="text-sm text-teal">
									{{ fullName(message.authorId) }}
								</p>
								<p class="text-sm mt-1">
									{{ message.content }}
								</p>
								<p class="text-right text-grey-dark mt-1">
									{{ moment(message.createdAt).format("hh:mm a") }}
								</p>
							</div>
						</div>
						<div v-else class="flex justify-end mb-2">
							<div class="rounded py-2 px-3" style="background-color: #e2f7cb">
								<p class="text-sm mt-1">
									{{ message.content }}
								</p>
								<p class="text-right text-grey-dark mt-1">
									{{ moment(message.createdAt).format("hh:mm a") }}
								</p>
							</div>
						</div>
					</template>
				</template>
			</div>
		</div>
		<InputMessage />
	</div>
</template>

<style scoped>
@media (max-width: 800px) {
	.messagesView {
		width: 100%;
		height: 100%;
	}
}
</style>
