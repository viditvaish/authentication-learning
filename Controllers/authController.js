const User=require('./../Models/userModel');

const asyncErrorHandler=require('./../utils/asyncErrorHandler');
const ApiFeatures=require('./../utils/ApiFeatures')

const jwt=require('jsonwebtoken');

const CustomError=require('./../utils/CustomError')

const util=require('util');

const signToken=id=>{
    return jwt.sign({id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXPIRES
    })
}
exports.signup=asyncErrorHandler(async(req,res,next)=>{
        const newUser=await User.create(req.body);
        const token=signToken(newUser._id)
        res.status(201).json({
            status:"success",
            token,
            data:{
                user:newUser
            }
           });
     
     
});

exports.login=asyncErrorHandler(async (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;

    if(!email || !password)
    {
        const error=new CustomError('Please provide email Id and password for logging in!',400);
        return next(error);
    }

    const user=await User.findOne({email}).select('+password');

    //const isMatch=await user.comparePasswordInDb(password,user.password);

    if(!user || !(await user.comparePasswordInDb(password,user.password)))
    {
        const error=new CustomError('Incorrect email or password',400);
        return next(error);
    }
    const token=signToken(user._id)
    res.status(200).json({
        status:'success',
        token
    })
});

exports.protect= asyncErrorHandler(async (req,res,next)=>{
   // 1)Read the token and check if it exists or not
       const testToken=req.headers.authorization;

       let token;
       if(testToken && testToken.startsWith('Bearer'))
       {
          token=testToken.split(' ')[1];
       }
       if(!token)
       {
          next(new CustomError('You arenot logged in!',401));
       }

   //2)Validate the token 
      
      const decodedToken=await util.promisify(jwt.verify)(token,process.env.SECRET_STR);
      
      console.log(decodedToken);
   //3)Check if the user exists in the database or not
      
      const user=await User.findById(decodedToken.id)
      
      if(!user)
      {
        const error=new CustomError('The user with given token does not exist',401);
        next(error);
      }
   //4)If the user changed his password after the token was issued 
   const isPasswordChanged=await user.isPasswordChangedAt(decodedToken.iat)
     if(isPasswordChanged)
     {
        const error=new CustomError('The password has been changed recently please login again',401);
        return next(error);
     }

   //5)Allow user to access the rutes 
   req.user=user;
   next();

});

exports.restrict=(role)=>{
    return (req,res,next)=>{
        if(req.user.role!==role)
        {
            const error=new CustomError('You do not have permission to perform this action',403);
            next(error);
        }
        next();
    }
}
