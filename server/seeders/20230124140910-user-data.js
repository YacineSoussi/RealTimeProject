'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  async up (queryInterface, Sequelize) {
   const users = await queryInterface.bulkInsert('users', [
      {
        id: 1,
        firstName: "Yacine",
        lastName:"Soussi",
        email: "Yacine1.soussi@gmail.com",
        password: "azertyuiop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        firstName: "Roulio",
        lastName: "Perreira",
        email: "Roulio@perreira.com",
        password: "azertyuiop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        firstName: "Ali",
        lastName: "Raid",
        email: "Ali@raid.com",
        password: "azertyuiop",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        firstName: "Amin",
        lastName: "Nairi",
        email: "Amin@nairi.com",
        password: "azertyuiop",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      ], {});
      const usersIds = users.map(u => u.id);
     
      const communicationRequests = await queryInterface.bulkInsert('communication_requests', [
        {
          clientId: 1,
          status: "pending",
          message: "Hello, I'm interested in your product",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          clientId: 2,
          status: "pending",
          message: "Hello, I'm interested in your product",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
    

      const conversations = await queryInterface.bulkInsert('Conversation', [ 
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          type: "conversation",
          maxParticipants: 2,
          completed: false,
        },
        {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          type: "room",
          maxParticipants: 35,
          completed: false,
        },
        {
          id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          type: "room",
          maxParticipants: 100,
          completed: false,
        },
        
      ], {});

      const participants = await queryInterface.bulkInsert('participant', [
        {
          userId: 1,
          conversationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          conversationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          conversationId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          conversationId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          conversationId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

      ], {});
      
    },


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
