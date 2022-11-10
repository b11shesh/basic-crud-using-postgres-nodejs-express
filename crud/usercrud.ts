import user from "../models/user";
import userrole from "../models/userrole";
import express from 'express';
import sequelize from "../dbConnection/database";
import { addInErrorFile, addInLogFile, getPagination} from "../commonHelper";
import * as jwt from "jsonwebtoken";
import fs, { read } from "fs";
import userlogininfo from "../models/userlogininfo";
import { QueryTypes, Sequelize } from "sequelize";
import { IDecoded } from "../commonHelper";


const app = express();
app.use(express.json());


export const getUserInfo =async (req:express.Request, res: express.Response) => {
    user.belongsTo(userrole, {foreignKey: 'userroleid'});
    userrole.hasMany(user, {foreignKey: 'userroleid'});
    user.findAll({
        include: [userrole]
    }).then(user=>{
        const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

        const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Get Employee API\" \n`

        addInLogFile(message);
        return res.status(200).send(user);
    }).catch(err=>{
            const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

            const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

            addInErrorFile(message);
        return res.status(500).send({
            message: err.message
        });
    })
    
}

export const downloadImg = async (req:express.Request, res:express.Response) => {
        const id = req.params.id;
        user.findByPk(id)
        .then(data=>{
            var filename = "D:\\ITH (NODE.JS)\\CRUD\\" + (data?.getDataValue("useravatar") as string).trim();
            
            fs.readFile(filename, function(err,data){
                if (!err){
                    const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

                    const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"Used Download Image API\" \n`

                    addInLogFile(message);

                    res.writeHead(200,{'Content-Type': 'image/jpeg'});
                    res.end(data);
                } else{
                    const decodedToken = jwt.decode(req.headers.authorization?.split(" ")[1] as string); 

                    const message = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${req.method} ${req.path} ${(decodedToken as IDecoded)?.id} ${(decodedToken as IDecoded)?.username.trim()} \"${err.message}\" \n`

                    addInErrorFile(message);
                    throw err
                };
                
            });
            
        });    
}


export const getUserLoginInfo = async (req: express.Request, res: express.Response)=>{
    // const users = await sequelize.query(`select distinct userid, max(logindatetime) as logindate, max(logoutdatetime) as logoutdate, "user".username from userlogininfo join "user" 
    // on userlogininfo.userid = "user".id 
    // group by userid, "user".username`, {type: QueryTypes.SELECT })
    const search = req.query.search;
    const page:number = parseInt(req.query.pageNo as string) ;
    const size:number = parseInt(req.query.pageSize as string) ;
    const datetimefrom= req.query.datetimefrom as string;
    const datetimeto = req.query.datetimeto as string;
    sequelize.query("SELECT * FROM get_userlogininfo("+search+","+page+","+size+","+datetimefrom+","+datetimeto+")", {type: QueryTypes.SELECT})
    .then(data=>{
        return res.status(200).send(data);
    }).catch(err=>{
        return res.status(500).send({message: err.message});
    })   
}







            