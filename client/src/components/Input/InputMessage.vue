<script setup>
import { inject, computed } from "vue";
import { useConversationStore } from "../../stores/ConversationStore";

const conversationStore = useConversationStore();
const createMessage = inject("ProviderCreateMessage");
const selectedConversationId = computed(
	() => conversationStore.selectedConversationId
);
const User = inject("ProviderUser");
const onSubmit = async (e) => {
	e.preventDefault();

	const content = document.getElementById("textMessage").value;
	const body = {
		content,
		conversationId: selectedConversationId.value,
		authorId: User.id,
	};

	try {
		await createMessage(body);
		document.getElementById("textMessage").value = "";
	} catch (error) {
		console.log(error);
	}
};
</script>

<template>
	<form @submit="onSubmit">
		<div class="bg-grey-lighter px-4 py-4 flex items-center">
			<div class="flex-1 mx-4">
				<input
					class="w-full border rounded px-2 py-2"
					type="text"
					id="textMessage"
				/>
			</div>
			<div>
				<font-awesome-icon
					type="submit"
					icon="paper-plane"
					style="cursor: pointer"
					id="sendMessage"
					@click="onSubmit"
				/>
			</div>
		</div>
	</form>
</template>

<style scoped></style>
