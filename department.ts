import { DataTypes } from "sequelize";
import sequelize from "./database";


const department = sequelize.define(
    "department",{
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: DataTypes.STRING    
},
{
    tableName: 'department',
    timestamps: false});

export default department;