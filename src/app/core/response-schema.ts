export interface successResponseData{
    success:boolean;
    data:any;
    msg:string;
    statuscode:number;
}
export interface errorResponseData{
    success:boolean;
    msg:string;
    statuscode:number;
    data:any
}