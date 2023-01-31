<script setup>
import NavConversationsVue from "./ListConversations/NavConversationsView.vue";
import MessagesView from "./BlockMessage/MessagesView.vue";
import ConversationProvider from "../../components/providers/ConversationProvider.vue";
</script>

<template>
	<section class="global">
		<div class="py-6 main">
			<div class="flex border border-grey rounded shadow-lg h-full globalBloc">
				<ConversationProvider>
					<NavConversationsVue />
					<MessagesView />
				</ConversationProvider>
			</div>
		</div>
	</section>
</template>

<style scoped>
.global {
	margin: 40px 50px 20px 50px;
}

.global .main {
	height: 500px;
}

@media (max-width: 800px) {
	.global .main {
		height: 1000px;
	}

	.global .globalBloc {
		flex-direction: column;
	}
}

@media (max-width: 550px) {
	.global {
		margin: 40px 15px 20px 15px;
	}
}
</style>
