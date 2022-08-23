import { DataTypes } from "sequelize";
import sequelize from "../dbConnection/database";



const userrole = sequelize.define(
    "roles", {
        userroleid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING
    },
    {
        
        tableName:'userrole',
        timestamps:false
    }
);

export default userrole;