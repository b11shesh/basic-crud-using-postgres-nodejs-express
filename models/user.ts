import { DataTypes } from "sequelize";
import sequelize from "../dbConnection/database";

export interface IUser{
    username: string;
    id: number;
    password:string;
    email:string;
    userroleid: number;
}

const user  = sequelize.define(
    "user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        userroleid: DataTypes.INTEGER,
        useravatar: DataTypes.STRING
    },
    {
        modelName:'user',
        tableName:'user',
        timestamps:false
    }
);

export default user;