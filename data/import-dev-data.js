const mongoose=require('mongoose');
const dotenv=require('dotenv');
const fs=require('fs');
const Movie=require('./../Models/movieModel');

dotenv.config({path:'./config.env'})

mongoose.connect(process.env.CONN_STR).then((conn)=>{
    console.log("DB connection is Successful")
}).catch((error)=>{
  console.log("Some error has occured")
})

const movies=JSON.parse(fs.readFileSync('./data/movies.json','utf-8'));

const deleteMovies=async()=>{
    try{
       await Movie.deleteMany();
       console.log("Data successfully deleted")
    }
    catch(err){
       console.log(err.message)
    }
    process.exit();
}

const importMovies=async ()=>{
    
    try{
       await Movie.create(movies);
       console.log("Data successfully created!")
    }
    catch(err)
    {
       console.log(err.message)
    }
    process.exit();

}

console.log(process.argv)

if(process.argv[2]==='--import')
{
    importMovies();
}
if(process.argv[2]==='--delete')
{
    deleteMovies();
}