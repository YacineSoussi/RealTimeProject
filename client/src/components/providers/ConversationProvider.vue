<script setup>
import { ref, reactive, provide, onMounted, watchEffect } from 'vue'
import ConversationLogic from '../../logics/ConversationLogic';
import MessageLogic from '../../logics/MessageLogic';
import LocalStorage from '../../services/LocalStorage';

const User = LocalStorage.get('user');

const messages = ref([]);
const conversations = ref([]);
const selectedConversation = ref(null);
const selectedConversationId = ref(null);
const updatedConversation = ref(null);
const participantsOFConversation = ref(null);

const getConversations = () => {
    return ConversationLogic.getConversations()
        .then((data) => {
            const conversations = data.map((conversation) => {
                let lastMessage = null;

                if (conversation.messages.length > 0) {
                    lastMessage = conversation.messages[conversation.messages.length-1];
                }
                return {
                    ...conversation,
                    lastMessage
                }
            });
            conversations.value = conversations;
        })
};

const getConversationOfUser = () => {
    return ConversationLogic.getConversationOfUser(User.id)
        .then((data) => {
            
            const myConversations = data.map((conversation) => {
                let lastMessage = null;

                if (conversation.messages.length > 0) {
                    lastMessage = conversation.messages[0];
                }
                return {
                    ...conversation,
                    lastMessage
                }
            });
            conversations.value = myConversations;
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
            // On trie les messages par date de creation pour eviter de changer l'ordre des messages quand ils sont modifié
            const sortedConversation = data.messages.sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
            });

            data.messages = sortedConversation;

            let lastMessage = null;

            if (data.messages.length > 0) {
                lastMessage = data.messages[data.messages.length-1];
            }
            const newConversation = {
                ...data,
                lastMessage
            }
            selectedConversation.value = newConversation;
            return newConversation;
        })
};

const createConversation = (form) => {
    return ConversationLogic.createConversation({...form, completed: true, maxParticipants: 2})
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

const getParticipants = (id) => {
    return ConversationLogic.getParticipants(id)
        .then((data) => {
            participantsOFConversation.value = data;
            return data;
        })
};

// Au changement de la conversation selectionnée, on récupère les messages de la conversation
watchEffect(() => {
    if (selectedConversationId.value) {
        getConversation(selectedConversationId.value);
        getParticipants(selectedConversationId.value);
    }
});

onMounted(() => {
    getParticipants(8);
});



provide('ProviderMessages', messages);
provide('ProviderConversations', conversations);
provide('ProviderSelectedConversation', selectedConversation);
provide('ProviderSelectedConversationId', selectedConversationId);
provide('ProviderUpdatedConversation', updatedConversation);
provide('ProviderUser', User);
provide('ProviderParticipantsOFConversation', participantsOFConversation);


provide('ProviderGetConversations', getConversations);
provide('ProviderGetConversationOfUser', getConversationOfUser);
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