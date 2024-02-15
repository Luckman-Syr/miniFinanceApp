module.exports = (sequelize, DataTypes) => {
    // Define Rekening model
    const Rekening = sequelize.define('Rekening', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        no_rekening: {
            type: DataTypes.STRING,
            allowNull: false
        },
        total_money: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pin: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updated_at'
        }
    }, {
        tableName: 'rekenings',
        // Add timestamps
        timestamps: true,
        sequelize
    });

    return Rekening;
}