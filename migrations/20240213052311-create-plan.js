'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plan', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      plan_spend: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rekening_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'updated_at'
      }
    });
    await queryInterface.addConstraint('plan', {
      type: 'foreign key',
      name: 'PLAN_REKENING_ID',
      fields: ['rekening_id'],
      references: {
        table: 'rekenings',
        field: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('plan');
  }
};