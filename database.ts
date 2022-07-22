import { Sequelize, Model, DataTypes } from "sequelize";

const user = 'postgres'
const host = 'localhost'
const database = 'postgres'
const password = 'bishesh'



const sequelize = new Sequelize(database , user, password ,{
    host, 
    dialect: "postgres",
    logging: false
})

export default sequelize;
