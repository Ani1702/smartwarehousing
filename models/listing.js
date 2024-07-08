const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const  Review= require("./review");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    // description:{
    //     type:String,
    //     required:true
    // },
    image:{
        type:Object,
        default:"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>
            v===""
            ?"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            :v
        },
    // price:{
    //     type:Number,
    //     required:true
    // },
    // location:{
    //     type:String,
    //     required:true
    // },
    // country:{
    //     type:String,
    //     required:true
    // },

    address:{
        type:String,
        required:true
    },

    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
