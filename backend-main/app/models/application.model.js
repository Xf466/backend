module.exports = (sequelize, Sequelize) => {
    const Application = sequelize.define("applications", {
        application_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        referral_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "referrals",
                key: "referral_id"
            },
            onDelete: "CASCADE"
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id"
            },
            onDelete: "CASCADE"
        },
        application_status: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        application_file_name: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        proof_file_name: {
            type: Sequelize.STRING(30),
            allowNull: true
        }
        });
  
    return Application;
  };