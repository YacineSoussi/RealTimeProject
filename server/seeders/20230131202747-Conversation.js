'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users";`
    );


    await queryInterface.bulkInsert(
      "Conversations",
      [
        {
          id: 1,
          name: "",
          type: "conversation",
          maxParticipants: 2,
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "First Room",
          type: "room",
          maxParticipants: 10,
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], {});
     
    await queryInterface.bulkInsert(
      "participants",
      [
        {
          userId: users[0][0].id,
          conversationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: users[0][1].id,
          conversationId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: users[0][2].id,
          conversationId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: users[0][3].id,
          conversationId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: users[0][0].id,
          conversationId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: users[0][1].id,
          conversationId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

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
