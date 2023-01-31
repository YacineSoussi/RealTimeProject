const { Model, DataTypes,  Sequelize } = require("sequelize");
const connection = require("../db");

class CommunicationRequest extends Model {}

CommunicationRequest.init(
    {
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: connection,
        modelName: "communication_requests",
    }
);
  
module.exports = CommunicationRequest;


// const CommunicationRequest = Sequelize.define('communication_request', {
//     id: {
//       type: Sequelize.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     clientId: {
//         type: Sequelize.INTEGER,
//         references: {
//           model: 'users',
//           key: 'id',
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'SET NULL',
//       },
//     status: {
//       type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
//       allowNull: false,
//     },
//     message: {
//       type: Sequelize.STRING,
//       allowNull: true,
//     },
//   });

 


  
module.exports = CommunicationRequest;


