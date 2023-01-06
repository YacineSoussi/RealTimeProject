<script setup>
import { ref, onMounted, inject, reactive } from 'vue';
import UserLogic from '../../logics/UserLogic';
import RoomCard from '../../components/admin/RoomCard.vue';

const users = inject('ProviderUsers');
const rooms = inject('ProviderRooms');
const createRoom = inject('ProviderCreateRoom');
const isEditing = ref(false);
const current_room = ref(null);


const changeIsEditing = () => {
    isEditing.value = !isEditing.value;
};

const addRoom = async (room) => {
    await createRoom(room).then((result) => {
        rooms.value.push(result);
    });
};

</script>

<template>

<div class="container w-full mx-auto pt-20">

<div class="w-full px-4 md:px-0 md:mt-8 mb-16 text-gray-800 leading-normal">

    <!--Console Content-->

    <div class="flex flex-wrap">
        <div class="w-full md:w-1/2 xl:w-1/3 p-3">
            <!--Metric Card-->
            <div class="bg-white border rounded shadow p-2">
                <div class="flex flex-row items-center">
                    <div class="flex-shrink pr-4">
                        <div class="rounded p-3 bg-green-600"><i class="fa fa-wallet fa-2x fa-fw fa-inverse"></i></div>
                    </div>
                    <div class="flex-1 text-right md:text-center">
                        <h5 class="font-bold uppercase text-gray-500">Communications en attente</h5>
                        <h3 class="font-bold text-3xl">$3249 <span class="text-green-500"><i class="fas fa-caret-up"></i></span></h3>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="w-full md:w-1/2 xl:w-1/3 p-3">
            <!--Metric Card-->
            <div class="bg-white border rounded shadow p-2">
                <div class="flex flex-row items-center">
                    <div class="flex-shrink pr-4">
                        <div class="rounded p-3 bg-pink-600"><i class="fas fa-users fa-2x fa-fw fa-inverse"></i></div>
                    </div>
                    <div class="flex-1 text-right md:text-center">
                        <h5 class="font-bold uppercase text-gray-500">Total Users</h5>
                        <h3 class="font-bold text-3xl">{{users ? users.length : null}} <span class="text-pink-500"><i class="fas fa-exchange-alt"></i></span></h3>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="w-full md:w-1/2 xl:w-1/3 p-3">
            <!--Metric Card-->
            <div class="bg-white border rounded shadow p-2">
                <div class="flex flex-row items-center">
                    <div class="flex-shrink pr-4">
                        <div class="rounded p-3 bg-yellow-600"><i class="fas fa-user-plus fa-2x fa-fw fa-inverse"></i></div>
                    </div>
                    <div class="flex-1 text-right md:text-center">
                        <h5 class="font-bold uppercase text-gray-500">Total rooms</h5>
                        <h3 class="font-bold text-3xl">{{ rooms ? rooms.length : null }} <span class="text-yellow-600"><i class="fas fa-caret-up"></i></span></h3>
                    </div>
                </div>
            </div>
            
        </div>
    </div>

    <!--Divider-->
    <hr class="border-b-2 border-gray-400 my-8 mx-4">

    <div class="flex flex-row flex-wrap flex-grow mt-2">

        <div class="w-full md:w-1/2 p-3">
            <RoomCard v-if="isEditing" :room="current_room" :addRoom="addRoom" :changeIsEditing="changeIsEditing" />
            <div v-else class="bg-white border rounded shadow">
                <div class="border-b p-3">
                    <h5 class="font-bold uppercase text-gray-600">Users</h5>
                </div>
                <div class="p-5">
                    <table class="w-full p-5 text-gray-700">
                        <thead>
                            <tr>
                                <th class="text-left text-blue-900">Nom</th>
                                <th class="text-left text-blue-900">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in users" :key="user.id">
                                <td>{{user.firstName + ' ' + user.lastName}}</td>
                                <td>{{user.email}}</td>
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
                        <h5 class="font-bold uppercase text-gray-600">Rooms</h5>
                    </div>
                    <div>
                            <font-awesome-icon icon="circle-plus" style="cursor: pointer" @click="changeIsEditing" />
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
                                <td>{{room.name}}</td>
                                <td>{{room.maxParticipants}}</td>
                                <td>{{room.participants.length}}</td>
                                <td> <font-awesome-icon icon="pen-to-square" style="color: blue;" />
                                <font-awesome-icon icon="trash" style="color: #d71a1a; margin-left: 5px;" />
                            </td>
                            </tr>
                        </tbody>
                    </table>
                  
                </div>
            </div>
            
        </div>
       

        <!-- <div class="w-full md:w-1/2 xl:w-1/3 p-3">
            
            <div class="bg-white border rounded shadow">
                <div class="border-b p-3">
                    <h5 class="font-bold uppercase text-gray-600">Graph</h5>
                </div>
                <div class="p-5">
                    <canvas id="chartjs-1" class="chartjs" width="undefined" height="undefined"></canvas>
                   
                </div>
            </div>
            
        </div>

        <div class="w-full md:w-1/2 xl:w-1/3 p-3">
            
            <div class="bg-white border rounded shadow">
                <div class="border-b p-3">
                    <h5 class="font-bold uppercase text-gray-600">Graph</h5>
                </div>
                <div class="p-5"><canvas id="chartjs-4" class="chartjs" width="undefined" height="undefined"></canvas>
                
                </div>
            </div>
            
        </div>

        <div class="w-full md:w-1/2 xl:w-1/3 p-3">
            
            <div class="bg-white border rounded shadow">
                <div class="border-b p-3">
                    <h5 class="font-bold uppercase text-gray-600">Template</h5>
                </div>
                <div class="p-5">

                </div>
            </div>
            
        </div>

        <div class="w-full p-3">
            <div class="bg-white border rounded shadow">
                <div class="border-b p-3">
                    <h5 class="font-bold uppercase text-gray-600">Table</h5>
                </div>
                <div class="p-5">
                    <table class="w-full p-5 text-gray-700">
                        <thead>
                            <tr>
                                <th class="text-left text-blue-900">Name</th>
                                <th class="text-left text-blue-900">Side</th>
                                <th class="text-left text-blue-900">Role</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Obi Wan Kenobi</td>
                                <td>Light</td>
                                <td>Jedi</td>
                            </tr>
                            <tr>
                                <td>Greedo</td>
                                <td>South</td>
                                <td>Scumbag</td>
                            </tr>
                            <tr>
                                <td>Darth Vader</td>
                                <td>Dark</td>
                                <td>Sith</td>
                            </tr>
                        </tbody>
                    </table>

                    <p class="py-2"><a href="#">See More issues...</a></p>

                </div>
            </div>
            
        </div> -->

       
    </div>
    
</div>


</div>
</template>

<style scoped>
</style>