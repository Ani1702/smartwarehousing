const mongoose=require("mongoose");
const {Schema}=mongoose;

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now().toLocaleString("en-IN"),
    }
})

module.exports=mongoose.model("Review",reviewSchema);