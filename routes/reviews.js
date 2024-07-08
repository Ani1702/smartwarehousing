const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js"); 
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const validateReview=(req,res,next)=>{
    let {err}=reviewSchema.validate(req.body);
    if(err){
        let errMsg=err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,err);
    }else{
        next();
    }
}

//REVIEW POSTING ROUTE:
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    console.log(req.params.id);
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.reviews);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save(); //Since we have created a review model and hence a realtion between the two collections.
    req.flash("success","New review created!");
    res.redirect(`/listings/${listing._id}`);
    // res.send("Review was saved.")
}));

//Review DELETE Route:
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports=router;