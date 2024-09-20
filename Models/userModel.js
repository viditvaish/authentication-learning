const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt')
const userSchema= new mongoose.Schema({
        name:{
            type: String,
            required: [true,'Please enter your name.']
        },
        email:{
            type: String,
            required: [true,'Please enter your email.'],
            unique: true,
            lowercase: true,
            validate:[validator.isEmail,'Please enter valid email']
        },
        photo:String,
        role:{
            type:String,
            enum:['user','admin'],
            default:'user'
        },
        password: {
            type: String,
            required:[true,'Please enter aa password'],
            minlength: 8,
            select:false
        },
        confirmPassword: {
            type: String,
            required:[true,'Please confirm your passowrd.'],
            validate:{
                validator:function (val) {
                    return val==this.password;
                },     
                message:'Passord and confirm Password are not same'
            }
        },
        passwordChangedAt:Date
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    // encrypt password before saving it
    this.password=await bcrypt.hash(this.password,12)
    
    this.confirmPassword=undefined;
    next();
})
userSchema.methods.comparePasswordInDb=async function(pswd,pswdDB){
    return await bcrypt.compare(pswd,pswdDB);
}
userSchema.methods.isPasswordChangedAt=async function(JWTTimestamp){
    if(this.passwordChangedAt)
    {
        const pswdChangedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        //console.log(pswdChangedTimestamp,JWTTimestamp);
        return JWTTimestamp<pswdChangedTimestamp;
    }
    return false;
}
const User=mongoose.model('User',userSchema)

module.exports=User;