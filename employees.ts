import { Sequelize,  DataTypes } from "sequelize";
import sequelize from "./database";

const Employees = sequelize.define(
    "employees",{
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name : DataTypes.STRING,
    address: DataTypes.STRING,
    contact: DataTypes.STRING,
    dob: DataTypes.STRING,
    departmentId : DataTypes.INTEGER
},{
    timestamps: false
});

export default Employees;