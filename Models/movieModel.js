const mongoose=require('mongoose')
const fs=require('fs');
const validator=require('validator');
const moviesSchema=new mongoose.Schema({
    name :{
        type:String,
        required:[true,'Name is required field!'],
        unique:true,
        trim:true
    },
    description:{
        type:String,
        required:[true,'Name is required field!'],
        trim:true
    },
    duration:Number,
    ratings:{
        type:Number,
    },
    totalRating:{
        type:Number
    },
    releaseYear:{
        type:Number,
        required:[true,'releaseYear is required field!']
    },
    releaseDate:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    genres:{
        type:[String],
        required:[true,'genre is required field!']
    },    
    directors:{
        type:[String],
        required:[true,'directors is required field!']
    },
    coverImage:{
        type:[String],
        require:[true,'Cover image is a required field']
    },
    actors:{
        type:[String],
        require:[true,'actors is a required field']
    },
    price:{
        type:[String],
        require:[true,'price is a required field']
    },
    createdBy:String

}, {
    toJSON: {virtuals:true},
    toObject:{virtuals:true}
})
moviesSchema.virtual('durationInHours').get(function(){
    return this.duration/60;
})

moviesSchema.pre('save',function(next){
    this.createdBy='MANOJJHA';
    next();
})

moviesSchema.post('save',function(doc,next){
    const content=`A new document with name  ${doc.name} has been created by has benn created by ${doc.createdBy}\n`;
    fs.writeFileSync('./Log/log.txt',content,{flag:'a'},(err)=>{
        console.log(err.message);
        next();
    });
})
moviesSchema.pre(/^find/,function(next){
    this.find({releaseDate: {$lte:Date.now()}});
    this.startTime=Date.now();
    next();
})

moviesSchema.post(/^find/,function(docs,next){
    this.find({releaseDate: {$lte:Date.now()}});
    this.endTime=Date.now();
    const content=`Query took ${this.endTime-this.startTime} milliseconds to fetch the  document`;
    fs.writeFileSync('./Log/log.txt',content,{flag:'a'},(err)=>{
        console.log(err.message);
    });    
    next();
})

moviesSchema.pre('aggregate',function(){
    console.log(this.pipeline().unshift({$match:{releaseDate: { $lte: new Date()}}}));
    next();
})
const Movie=mongoose.model('Movie',moviesSchema)

module.exports=Movie;