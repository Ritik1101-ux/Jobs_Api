import mongoose from "mongoose";

const JobSchema=new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Please Provide Company Name']
    },
    role:{
        type:String,
        required:[true,'Please Provide Job Role']
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending',
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required: [true, 'Please provide user'],
    }
},{
    timestamps:true
});

const JobModel=mongoose.model('Job',JobSchema);

export default JobModel;