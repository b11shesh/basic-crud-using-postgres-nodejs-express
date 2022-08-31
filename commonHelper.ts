import sequelize,{ Model } from "sequelize";
import * as fs from 'fs';
import * as express from "express";
import config from "./auth/auth.config";
import jwt from "jsonwebtoken";
import multer from 'multer';
import path from "path";


export interface IDecoded{
    id: string,
    role: number,
    username: string,
}

interface IDepartmentRows{
    id: number
    name: string
}

interface IEmployeeRows{
    id :number
    name:string
    address: string
    contact: string
    dob: string
    departmentid: number    
}

export interface GenericType<C, R>{
    count:C
    rows: R
}


export const getPagination = (page:number,size:number) => {
    const limit =size? +(size??1): 1;
    const offset = page ? page * limit :0 ;
    return {limit, offset};
};

export const getPagingData = (data:GenericType<number,Model<IDepartmentRows, IEmployeeRows>[]>,page: number,limit: number)=>{
    const {count:totalItems, rows: tabledata} = data;
    const currentPage = page? +page :0;
    const totalPages = Math.ceil(totalItems/limit);

    return{ totalItems, tabledata, totalPages, currentPage};
};

export const getDecodedData =(req: express.Request, _:express.Request)=>{
    const token = req.headers.authorization?.split(" ")[1];

        
        const decodedToken = jwt.decode(token as string) 

        return decodedToken 
}

export const addInLogFile =( data:string) =>{

    const date = new Date().toLocaleDateString().split("")
      for(let i=0; i< date.length; i++){ 
          if(date[i].includes("/")){ 
              date[i] = "_"
          } 
      }
  const filename =`/ITH (NODE.JS)/crud/log/logfile_${date.join("")}.txt`
    fs.appendFile(filename, data, (err)=>{
    if(err) console.log(err)
    
  });
}

export const addInErrorFile =( data:string) =>{

    const date = new Date().toLocaleDateString().split("")
      for(let i=0; i< date.length; i++){ 
          if(date[i].includes("/")){ 
              date[i] = "_"
          } 
      }
  const filename =`/ITH (NODE.JS)/crud/log/errorfile_${date.join("")}.txt`
    fs.appendFile(filename, data, (err)=>{
    if(err) console.log(err)
    
  });
}



export const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null,  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)+ path.extname(file.originalname) )
  }
});

export const upload = multer({storage: storage, limits: {
  fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
      cb(null, true);
    }else{
      cb(null, false);
      return cb(new Error("Only .jpg, .png, .jpeg format allowed!"));
    }
  }
});