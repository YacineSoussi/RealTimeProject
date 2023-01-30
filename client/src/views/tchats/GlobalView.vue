<script setup>
import NavConversationsVue from "./ListConversations/NavConversationsView.vue";
import MessagesView from "./BlockMessage/MessagesView.vue";
import ConversationProvider from "../../components/providers/ConversationProvider.vue";
</script>

<template>
	<div>
		<div class="w-full h-32"></div>
		<div class="container mx-auto" style="margin-top: -128px">
			<div class="py-6 h-screen">
				<div class="flex border border-grey rounded shadow-lg h-full">
					<ConversationProvider>
						<NavConversationsVue />
						<MessagesView />
					</ConversationProvider>
				</div>
			</div>
		</div>
	</div>
</template>
