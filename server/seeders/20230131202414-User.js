'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Amin',
        lastName: 'Nairi',
        email: 'Amin@Nairi.com',
        password: await bcrypt.hash('password', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Yacine',
        lastName: 'SOUSSI',
        email: 'Yacine@Soussi.com',
        password: await bcrypt.hash('password', 10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Julio',
        lastName: 'PERREIRA',
        email: 'Julio@Perreira.com',
        password: await bcrypt.hash('password', 10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Ali',
        lastName: 'RAID',
        email: 'Ali@RAID.com',
        password: await bcrypt.hash('password', 10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
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
