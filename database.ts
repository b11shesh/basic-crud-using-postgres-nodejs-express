import { Sequelize } from "sequelize";

const user = 'postgres'
const host = 'localhost'
const database = 'postgres'
const password = 'bishesh'
const port = 5432



const sequelize = new Sequelize(database , user, password ,{
    host, 
    port,
    dialect: "postgres",
    logging: false
})

export default sequelize;
