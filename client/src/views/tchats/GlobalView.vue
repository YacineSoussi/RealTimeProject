<script setup>
import NavConversationsVue from "./ListConversations/NavConversationsView.vue";
import MessagesView from "./BlockMessage/MessagesView.vue";
import ConversationProvider from "../../components/providers/ConversationProvider.vue";
</script>

<template>
	<section class="global">
		<div class="py-6 h-screen">
			<div class="flex border border-grey rounded shadow-lg h-full">
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
</style>
