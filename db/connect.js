import mongoose from 'mongoose';

const connectDB=async (uri)=>{
  mongoose.set('strictQuery',true);

  await mongoose.connect(uri)
  .then(()=>console.log('DB Connected'))
  .catch((error)=>console.log(error));

}

export default connectDB;