import { DataTypes } from "sequelize";
import sequelize from "../dbConnection/database";



const userlogininfo  = sequelize.define(
    "userlogininfo", {
        userlogininfoid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        userid: DataTypes.INTEGER,
        jwttoken: DataTypes.STRING,
        guid: DataTypes.UUID,
        logindatetime: DataTypes.DATE,
        logoutdatetime: DataTypes.DATE
    },
    {
        modelName:'userlogininfo',
        tableName:'userlogininfo',
        timestamps:false
    }
);

export default userlogininfo;