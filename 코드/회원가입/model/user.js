const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
        primaryKey: true
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: true,
				unique: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      class: {
        type: Sequelize.INTEGER(30),
        allowNull: true,
      },
      pAtt: {
        type: Sequelize.INTEGER,  //Enum
        allowNull: true,
      },
			Ry: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
			Lx: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
			Ly: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
			Lz: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
			lv: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
      },
			pmHP: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
			pcHP: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
			pExp: {
				type: Sequelize.INTEGER(30),
				allowNull: true,
    }}, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {};
}