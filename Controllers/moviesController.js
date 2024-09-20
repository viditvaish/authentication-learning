const Movie=require('./../Models/movieModel')

const ApiFeatures=require('./../utils/ApiFeatures')

const CustomError=require('./../utils/CustomError')
const asyncErrorHandler=require('./../utils/asyncErrorHandler')
    exports.getHighestRated=(req,res,next)=>{
         req.query.limit='5'
         req.query.sort='-ratings'
         next();
    };

    exports.getallmovies=asyncErrorHandler(async(req,res,next)=>{
             const features=new ApiFeatures(Movie.find(),req.query)
                                .sort()
                                .filter()
                                .limitfields()
                                .paginate();
             let movies=await features.query;
            //   console.log(req.query);
            //   let querystr=JSON.stringify(req.query);
            //   querystr=querystr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
            //   const queryobj=JSON.parse(querystr);
            //   delete queryobj.sort;
         
            // let  query=Movie.find(queryobj);


            // if(req.query.sort){
            //     const sortby=req.query.sort.split(',').join(' ');
            //     console.log(sortby)
            //     query=query.sort(sortby)
            // }
            // else{
            //     query=query.sort('-createdAt');
            // }

            // if(req.query.fields)
            // {
            //     const fields=req.query.fields.split(',').join(' ');
            //     query=query.select(fields);
            // }
            // else{
            //     query=query.select('-__v');
            // }

            // const page=req.query.page*1||1;
            // const limit=req.query.limit*1||10;
            
            // const skip=(page-1)*limit;
            // query=query.skip(skip).limit(limit)

            // if(req.query.page)
            // {
            //     const moviesCount=await Movie.countDocuments();
            //     if(skip >=moviesCount)
            //     {
            //         throw new Error("This page is not found!")
            //     }
            // }
        //     console.log(query);
        //    console.log(req.query.duration);

        //    const movies=await query;
           res.status(200).json({
            status:"success",
            length:movies.length,
            data:{
                movies
            }
           });
    });

    // exports.createmovie=asyncErrorHandler(async(req,res,next)=>{
    //        const movie=await Movie.create(req.body);

    //        res.status(201).json({
    //            status:"success",
    //            data:{
    //             movie
    //            }
    //        })
    // });

    exports.createmovie = asyncErrorHandler(async (req, res, next) => {
        console.log("Request body:", req.body);  // This should print the request body
        
        const movie = await Movie.create(req.body);
        
        console.log("Created movie:", movie);  // This should print the created movie
    
        res.status(201).json({
            status: "success",
            data: {
                movie,
            },
        });
    });
    
    
    exports.getmovie=asyncErrorHandler(async(req,res,next)=>{
           const movie=await Movie.findById(req.params.id);

           if(!movie)
           {
              const error=new CustomError('Moviw with id is not found',404);
              return next(error);
           }
           res.status(200).json({
              status:"success",
              data:{
                movie
              }
           })

    });

    exports.updatemovie=asyncErrorHandler(async(req,res,next)=>{
            const updateMovie=await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

            res.status(200).json({
              status:"success",
              data:{
                 movie:updateMovie
              }
            })
    });
    exports.deletemovie=asyncErrorHandler(async (req,res,next)=>{
           await Movie.findByIdAndDelete(req.params.id)

           res.status(204).json({
               status:"success",
               data:null
           })
    });

    exports.getmoviestats= asyncErrorHandler(async  (req,res,next)=>{
            const stats=await Movie.aggregate([
                {$match: {ratings :{$gte:4.5}}},
                {$group: {
                    _id:'$releaseYear',
                    avgRating:{$avg:'$ratings'},
                    avgPrice:{$avg:'$price'},
                    minPrice:{$min:'$price'},
                    maxPrice:{$max:'$price'},
                    priceTotal:{$sum:'$price'},
                    movieCount:{$sum:1},
                }},
                {$sort: {minPrice:1}},
               // {$match: {maxPrice:{$gte: 60}}}
            ]);
            res.status(200).json({
                status:"success",
                count:stats.length,
                data:{
                    stats
                }
            });
    });

    exports.getMoviesByGenre=asyncErrorHandler(async (req,res,next)=>{
            const genre=req.params.genre;
            const movies=await Movie.aggregate([
                {$unwind: '$genres'},
                {$group: {
                    _id:'$genres',
                    movieCount:{ $sum:1},
                    movieNames:{$push:'$name'}
                }},
                {$addFields:{genre: "$_id"}},
                {$project: {_id:0}},
                {$sort: {movieCount: -1}},
                {$match:{genre: genre}}
            ]);
            res.status(200).json({
                status:"success",
                count:movies.length,
                data:{
                    movies
                }
            });
        
    });