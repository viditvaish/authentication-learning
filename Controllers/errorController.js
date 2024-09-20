const CustomError=require('./../utils/CustomError')

const devErrors=(res,err)=>{
    res.status(err.statusCode).json({
        status: err.statusCode,
        message:  err.message,
        stackTrace: err.stackTrace,
        error: err
     })
}
const handleExpiredJwt=(err)=>{
    return new CustomError('JWT has expired Please login again!',401);
}

const handleJWTError=(err)=>{
    return new CustomError('Invalid Token please login again',401);
}


const prodErrors=(res,error)=>{
    if(error.isOperational)
    {
        res.status(error.statusCode).json({
            status:error.statusCode,
            message: error.message
         });
    }
    else
    {
        res.status(500).json({
            status:'error',
            message:'Something went wrong Please try again later '
        })
    }
    
}
const castErrorHandler=(err)=>{
    const msg=`Invalid Value ${err.value} for field  ${err.path}!`
    return new CustomError(msg,400);
}
module.exports=(error,req,res,next)=>{ 
    error.statusCode=error.statusCode || 500;
    error.status=error.status||'error';
    if(process.env.NODE_ENV==='developement')
    {
        devErrors(res,error);
    }
    else if(process.env.NODE_ENV==='production')
    {
        //let err={...error};
        if(error.name==='CastError')
        {
            error=castErrorHandler(error);
        }
        if(error.name==='TokeExpiredError')error=handleExpiredJwt(error);
        if(error.name==='JsonWebTokenError')error=handleJWTError(error);
        prodErrors(res,error);
    }
    
}