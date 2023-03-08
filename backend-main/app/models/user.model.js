module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(64),
        unique: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      linkedinid: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      verificationStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    });
  
    return User;
  };