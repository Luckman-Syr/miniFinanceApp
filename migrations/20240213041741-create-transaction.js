'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rekening_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      transaction_to: {
        type: Sequelize.STRING,
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
    await queryInterface.addConstraint('transactions', {
      type: 'foreign key',
      name: 'TRANSACTION_REKENING_ID',
      fields: ['rekening_id'],
      references: {
        table: 'rekenings',
        field: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};