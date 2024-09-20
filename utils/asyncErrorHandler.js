 module.exports=function asyncErrorHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.error("Error:", err);  // Log the error for debugging
            res.status(500).json({ status: 'fail', message: err.message });
        });
    };
  }





// (funct)=>{
// //     return (req,res,next)=>{
// //         funct(req,res,next).catch(err=>next(err));
// //     }
// // }