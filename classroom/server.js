const express=require("express");
const app=express();
const users=require("./routes/users.js");
const posts=require("./routes/posts.js");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs") ;

app.use(flash());

// app.use(cookieParser("shhhcode"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("Signed cooked sent, yeppie!");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("Verified");
// });

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madeIn","India");
//     res.send("sent some cookies");
// });

// //Root
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hey, I am root!");
// });

// app.use("/users",users);
// app.use("/posts",posts);

// //admin:
// app.get("/admin",(req,res)=>{
//     res.send("Admin space!")
// });

app.use(session({
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}));

app.get("/test",(req,res)=>{
    res.send("Test successful!");
});

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }

    res.send(`You sent the response ${req.session.count} times`);
});

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    req.flash("success","User registered successfully!");
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    // res.send(`Hello, ${req.session.name}`);
    res.locals.messages=req.flash("success"); //can be directly accessed in ejs template
    res.render("page.ejs",{name:req.session.name});
});

app.listen(3030,()=>{
    console.log("app is listening to port 3030");
});

