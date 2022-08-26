import { DataTypes } from "sequelize";
import sequelize from "../dbConnection/database";

const employees = sequelize.define(
    "employees",{
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name : DataTypes.STRING,
    address: DataTypes.STRING,
    contact: DataTypes.STRING,
    dob: DataTypes.STRING,
    filepath: DataTypes.STRING,
    departmentid : {
       type: DataTypes.INTEGER,
       references:{
        model: 'department',
        key: 'id'
       }  
    },
},{
    tableName: 'employees',
    timestamps: false
});

export default employees;