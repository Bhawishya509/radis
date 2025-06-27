import mongoose from "mongoose";

let userSchema=new mongoose.Schema({
    name:{
        required:true,
        type:String,
    }
    ,
    notebook:{
        type:String,
    },
    subjects:[{
        type:String
    }]
})


 function modelsConnection(collectioName)
{
let userModel=  mongoose.model(collectioName,userSchema)
return  userModel;
}
export default modelsConnection;

