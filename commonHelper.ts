import sequelize,{ Model } from "sequelize";

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

