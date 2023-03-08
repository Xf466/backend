module.exports = (sequelize, Sequelize) => {
    /*
    Thhe function of the code below is for create the model for ratings.
    */
    const Rating = sequelize.define("ratings", {
        application_id:{
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references:{
                model:"applications",
                key: "application_id"
            },    
        },
        referral_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "referrals",
                key: "referral_id"
            },
            onDelete: "CASCADE"
        },

        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: "users",
                key: "user_id"
            },
            onDelete: "CASCADE"
        },
        rating_score: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        rating_feedback: {
            type: Sequelize.STRING(300),
            allowNull: true
        }
        });
  
    return Rating;
  };