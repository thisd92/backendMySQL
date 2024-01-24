'use strict';
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        uuid: "f1313db8-05c3-434b-a7c8-0d7ede1f933b",
        username: "email@gmail.com",
        password: "456789",
        createdAt: null,
        updatedAt: null
      },
      {
        uuid: "c2203987-9f6a-4b36-8ee3-699ab6d60158",
        username: "thiago-dutra@dev-th.com.br",
        password: "123456",
        createdAt: null,
        updatedAt: null
      },
      {
        uuid: "d39a5be9-8d56-45df-b80d-e4353e5e45ad",
        username: "thiago-dutra@dev-th.tech",
        password: "159357",
        createdAt: null,
        updatedAt: null
      }
    ];

    for (let user of users) {
      user.password = await bcrypt.hash(user.password, 10); // O número 10 é o número de rounds do salt
      user.createdAt = new Date();
      user.updatedAt = new Date();
    }

    await queryInterface.bulkInsert('Users', users, {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});

  }
};
