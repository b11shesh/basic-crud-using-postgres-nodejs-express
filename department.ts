import { Sequelize, DataTypes } from "sequelize";
import sequelize from "./database";


const Department = sequelize.define(
    "department",{
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: DataTypes.STRING
    
        
},
{timestamps: false});

export default Department;