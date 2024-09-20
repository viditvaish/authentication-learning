const express=require('express')
const moviesController=require('./../Controllers/moviesController')
const router=express.Router();
const authController=require('./../Controllers/authController')

// router.param('id',moviesController.checkId);

router.route('/highest-rated').get(moviesController.getHighestRated,moviesController.getallmovies)

router.route('/movie-stats').get(moviesController.getmoviestats);
router.route('/movies-by-genre/:genre').get(moviesController.getMoviesByGenre);

router.route('/')
    .get(authController.protect,moviesController.getallmovies)
    .post(moviesController.createmovie)

router.route('/:id')
   .get(authController.protect,moviesController.getmovie)
   .patch(moviesController.updatemovie)
   .delete(authController.protect,authController.restrict('admin'),moviesController.deletemovie)


   module.exports=router;