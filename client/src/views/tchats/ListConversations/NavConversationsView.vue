<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import moment from 'moment';
import ModalRoomsVue from '../../../components/Modal/ModalRooms.vue';
import ModalChatVue from '../../../components/Modal/ModalChat.vue';

const rooms = inject ('ProviderRooms');
const conversations = inject('ProviderConversations');
const getConversationOfUser = inject('ProviderGetConversationOfUser');
const selectedConversationId = inject('ProviderSelectedConversationId');
const setSelectedConversationId = inject('ProviderSetSelectedConversationId');
const isOpenModal = inject('ProviderIsOpenModal');
const setIsOpenModal = inject('ProviderSetValueModal');
const isOpenModalChat = inject('ProviderIsOpenModalChat');
const setIsOpenModalChat = inject('ProviderSetValueModalChat');
const User = inject('ProviderUser');
const users = inject('ProviderUsers');


onMounted(() => {
    getConversationOfUser().then(() =>{
        if (conversations.value.length > 0) {
            selectedConversationId.value = conversations.value[0].id;
        }
    });
});

</script>

<template>
     <div class="w-1/3 border flex flex-col">
        <ModalRoomsVue v-if="isOpenModal" :rooms="rooms" />
        <ModalChatVue v-if="isOpenModalChat" :users="users"/>
<!-- Header -->
<div class="py-2 px-3 bg-grey-lighter flex flex-row justify-end items-center">
  
    <div class="flex">
        <div class="ml-4" >
              <font-awesome-icon @click="setIsOpenModalChat" icon="message" style="cursor: pointer;" class="mr-1" />
              <font-awesome-icon @click="setIsOpenModal" icon="users" style="cursor: pointer;" />
        </div>
      
    </div>
</div>

<!-- Search -->
<div class="py-2 px-2 bg-grey-lightest">
    <input type="text" class="w-full px-2 py-2 text-sm" placeholder="Search or start new chat"/>
</div>

<!-- Contacts -->
<div class="bg-grey-lighter flex-1 overflow-auto">
    <div @click="setSelectedConversationId(conversation.id)" v-for="conversation in conversations" class="px-3 flex items-center bg-grey-light cursor-pointer">
        <div>
            <img v-if="conversation.type === 'room' " class="h-12 w-12 rounded-full"
                 src="/roomLogo.png"/>
            <img v-else src="/messengerLogo.png" class="h-12 w-12 rounded-full" >
        </div>
        <div class="ml-4 flex-1 border-b border-grey-lighter py-4">
            <div class="flex items-bottom justify-between">
                <p class="text-grey-darkest">
                    {{conversation.name}}
                </p>
                <p class="text-xs text-grey-darkest">
                    {{ conversation.lastMessage ? moment(conversation.lastMessage.updatedAt).format('hh:mm a') : ''}}
                </p>
            </div>
            <p v-if="conversation.lastMessage" class="text-grey-dark mt-1 text-sm">
            {{conversation.lastMessage.authorId === User.id ? 'Moi : ' : conversation.lastMessage.author.firstName + ' ' + conversation.lastMessage.author.lastName +  ':  ' }} {{conversation.lastMessage ? conversation.lastMessage.content : ''}}
            </p>
        </div>
    </div>
</div>

</div>
</template>