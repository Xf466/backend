module.exports = (sequelize, Sequelize) => {
    const Referral = sequelize.define("referrals", {
        referral_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
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
        job_title: {
            type: Sequelize.STRING(50),
            allowNull: false
        
        },

        price: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },
        job_description: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        company: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        address: {
            type: Sequelize.STRING(150),
            allowNull: true
        }
        });
  
    return Referral;
  };