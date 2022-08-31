import { DataTypes } from "sequelize";
import sequelize from "../dbConnection/database";



const userlogininfo  = sequelize.define(
    "userlogininfo", {
        userlogininfoid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userid: DataTypes.INTEGER,
        jwttoken: DataTypes.STRING,
        guid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        } ,
        logindatetime: DataTypes.DATE,
        logoutdatetime: DataTypes.DATE,
        userroleid: DataTypes.INTEGER
    },
    {
        modelName:'userlogininfo',
        tableName:'userlogininfo',
        timestamps:false
    }
);

export default userlogininfo;