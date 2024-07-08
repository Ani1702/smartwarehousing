const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js"); 
const {isLoggedIn}=require("../middleware.js");

const validateReview=(req,res,next)=>{
    let {err}=reviewSchema.validate(req.body);
    if(err){
        let errMsg=err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,err);
    }else{
        next();
    }
}



//INDEX ROUTE: 
router.get("/",async(req,res)=>{
    allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})

//NEW ROUTE: GET REQUEST:
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("./listings/new.ejs");
});

//SHOW ROUTE: READ
router.get("/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
});

// //CREATE ROUTE: 
//     app.post("/listings",async (req,res,next)=>{
//         try{
//         const newListing=new Listing(req.body.listing)
//         await newListing.save()
//         res.redirect("/listings")
// } catch(err){
//     next(err);
//     }
// });

//CREATE ROUTE: 
router.post("/",wrapAsync(async (req,res,next)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid listing data.");
    // }
    listingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

//EDIT ROUTE:
router.get("/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
});

//UPDATE ROUTE:
router.patch("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid listing data.");
    }
    
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

//DELETE ROUTE:
router.delete("/:id",isLoggedIn,async (req,res)=>{
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted successfully!")
    res.redirect("/listings");
});



module.exports=router;
