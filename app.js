
const express=require('express');

const app=express();

const fs=require('fs');

const morgan=require('morgan');

const CustomError=require('./utils/CustomError');

const globalErrorHandler=require('./Controllers/errorController')

const authRouter=require('./Routes/authRouter')

const router=require('./Routes/moviesRoute');
const { error } = require('console');


const logger=function(req,res,next){
    console.log("Custom Middleware Created");
    next();
}
app.use(express.json());
if(process.env.NODE_ENV==='developement')
{
    app.use(morgan('dev'));

}
app.use(express.static('./public'))
app.use(logger);
app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString();
    next();
});
// app.get('/api/v1/movies',getallmovies);
// app.post('/api/v1/movies',createmovie);
// app.get('/api/v1/movies/:id',getmovie);
// app.patch('/api/v1/movies/:id',updatemovie);
// app.delete('/api/v1/movies/:id',deletemovie);

app.use('/api/v1/movies',router);
app.use('/api/v1/users',authRouter);
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'fail',
    //     message:`cant find ${req.originalUrl} on the server`
    // })

    // const err= new Error(`cant find ${req.originalUrl} on the server`);
    // err.status='fail';
    // err.statusCode=404;
    const err= new CustomError(`cant find ${req.originalUrl} on the server`,404);
    next(err);
});

app.use(globalErrorHandler);

module.exports=app;
