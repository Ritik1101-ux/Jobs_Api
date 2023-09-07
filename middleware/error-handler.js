import StatusCodes   from 'http-status-codes';
import CustomAPIError from '../errors/custom-api.js';

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || 'Internal Server Error'
  }
 
  if(err.name && err.name=='ValidationError'){
    customError.msg=Object.values(err.errors).map((item)=>item.message).join(',');
    customError.statusCode = 400
  }
  if(err.code && err.code===11000){
    customError.msg=`Duplicate Value Entered for ${Object.keys(err.keyValue)}`,
    customError.statusCode=400
  }

  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }
  
  return res.status(customError.statusCode).json({ msg:customError.msg})
}

export default errorHandlerMiddleware;
