"use strict";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("password", salt);
    queryInterface.bulkInsert("users", [
      {
        name: "Bagus Andreanto",
        email: "bagus.andreanto@yuhuu.com",
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        gender: "MALE",
        location: Sequelize.fn("ST_GeomFromText", "POINT(112.414250 -7.128594)"),
        preferredRange: 10000,
        preferredAgeMin: 20,
        preferredAgeMax: 30,
        age: 25,
      },
      {
        name: "Rose Doe",
        email: "rose.doe@yuhuu.com",
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        gender: "FEMALE",
        location: Sequelize.fn("ST_GeomFromText", "POINT(112.417857 -7.133227)"),
        preferredRange: 20000,
        preferredAgeMin: 20,
        preferredAgeMax: 30,
        age: 26,
      },
      {
        name: "Cindy Doe",
        email: "cindy.doe@yuhuu.com",
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        gender: "FEMALE",
        location: Sequelize.fn("ST_GeomFromText", "POINT(112.422281 -7.128926)"),
        preferredRange: 20000,
        preferredAgeMin: 20,
        preferredAgeMax: 30,
        age: 27,
      },
      {
        name: "Claire Doe",
        email: "claire.doe@yuhuu.com",
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        gender: "FEMALE",
        location: Sequelize.fn("ST_GeomFromText", "POINT(112.433106 -7.146507)"),
        preferredRange: 20000,
        preferredAgeMin: 20,
        preferredAgeMax: 30,
        age: 23,
      },
      {
        name: "Clara Doe",
        email: "clara.doe@yuhuu.com",
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        gender: "FEMALE",
        location: Sequelize.fn("ST_GeomFromText", "POINT(112.424947 -7.132114)"),
        preferredRange: 2000000,
        preferredAgeMin: 20,
        preferredAgeMax: 30,
        age: 24,
      },
      {
        name: "Alice Doe",
        email: "alice.doe@yuhuu.com",
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        gender: "FEMALE",
        location: Sequelize.fn("ST_GeomFromText", "POINT(112.453461 -7.120702)"),
        preferredRange: 2000,
        preferredAgeMin: 20,
        preferredAgeMax: 25,
        age: 22,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
