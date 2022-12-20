<script setup>
import { ref, reactive, provide, onMounted } from 'vue'
import ConversationLogic from '../../logics/ConversationLogic';
import MessageLogic from '../../logics/MessageLogic';

const messages = ref([]);
const conversations = ref([]);
const selectedConversation = ref(null);
const selectedConversationId = ref(null);
const updatedConversation = ref(null);

const getConversations = () => {
    return ConversationLogic.getConversations()
        .then((data) => {
            conversations.value = data;
            console.log('conversations.value', conversations.value)
        })
};

const getMessages = (id) => {
    return MessageLogic.getMessages(id)
        .then((data) => {
            messages.value = data;
        })
};

const getConversation = (id) => {
    return ConversationLogic.getConversation(id)
        .then((data) => {
            selectedConversation.value = data;
        })
};

const createConversation = (form) => {
    return ConversationLogic.createConversation({...form})
        .then((data) => {
            conversations.value.push(data);
            selectedConversationId.value = data.id;
        })
};

const createRoom = (form) => {
    return ConversationLogic.createRoom({...form})
        .then((data) => {
            conversations.value.push(data);
            selectedConversationId.value = data.id;
        })
};

const updateConversation = (id, form) => {
    return ConversationLogic.updateConversation(id, {...form})
        .then((data) => {
            updatedConversation.value = data;
        })
};

const deleteConversation = (id) => {
    return ConversationLogic.deleteConversation(id)
        .then((data) => {
            conversations.value = conversations.value.filter((conversation) => conversation.id !== id);
        })
};

const createMessage = (id, form) => {
    return MessageLogic.createMessage(id, {...form})
        .then((data) => {
            messages.value.push(data);
        })
};

const updateMessage = (id, form) => {
    return MessageLogic.updateMessage(id, {...form})
        .then((data) => {
            messages.value = messages.value.map((message) => {
                if (message.id === id) {
                    return data;
                }
                return message;
            })
        })
};

const deleteMessage = (id) => {
    return MessageLogic.deleteMessage(id)
        .then((data) => {
            messages.value = messages.value.filter((message) => message.id !== id);
        })
};

const setSelectedConversationId = (id) => {
    selectedConversationId.value = id;
};

// Quand la valeur de selectedConversationId change, on récupère la conversation correspondante
// selectedConversationId.watch((id) => {
//     if (id) {
//         getConversation(id);
//     }
// });

onMounted(() => {
    getConversations();
});

provide('ProviderMessages', messages);
provide('ProviderConversations', conversations);
provide('ProviderSelectedConversation', selectedConversation);
provide('ProviderSelectedConversationId', selectedConversationId);
provide('ProviderUpdatedConversation', updatedConversation);


provide('ProviderGetConversations', getConversations);
provide('ProviderGetMessages', getMessages);
provide('ProviderGetConversation', getConversation);
provide('ProviderCreateConversation', createConversation);
provide('ProviderUpdateConversation', updateConversation);
provide('ProviderDeleteConversation', deleteConversation);
provide('ProviderCreateMessage', createMessage);
provide('ProviderUpdateMessage', updateMessage);
provide('ProviderDeleteMessage', deleteMessage);
provide('ProviderSetSelectedConversationId', setSelectedConversationId);
provide('ProviderCreateRoom', createRoom);


</script>

<template>
    <slot></slot>
</template>