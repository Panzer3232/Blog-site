var express  = require("express"),
    app      = express(),
    methodOverride = require("method-override"),
    sanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");
    
    mongoose.connect("mongodb://localhost/logs");
    app.use(bodyParser.urlencoded({extended : true}));
    app.use(sanitizer());
    app.use(methodOverride("_method"));
    app.engine('ejs', require('ejs').renderFile);
    app.set('view engine','ejs');  
    
    
var blogSchema = new mongoose.Schema({ 
    title : String,
    image : String,
    body : String,
    created : {type : Date , default :Date.now}
});
var blog = mongoose.model("Blogs",blogSchema);


app.get("/",function(req,res){
    res.redirect("/blogs");
});
//index
app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs : blogs})
        }
    });
});
//New route
app.get("/blogs/new",function(req,res){
    res.render("new");
});
   
  // Create Route 
app.post("/blogs",function(req,res){
   // req.body.blog.body = req.sanitizer(req.body.blog.body);
    blog.create(req.body.blog,function (err,newBlog){
        if(err){
            res.render(err);
        }
        else{
            res.redirect("/blogs");
        }
    });
});
// show route
app.get("/blogs/:id", function(req, res){
	blog.findById(req.params.id, function(err, foundBlog){
		if(err){
            res.redirect("/");
            //console.log(err);
		} else {
            res.render("show.ejs", {blog: foundBlog});
            
        }
       // console.log(foundBlog);
	})
});
//Edit Route

app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog : foundBlog});
        }
    });
});
//Update Route
app.put("/blogs/:id",function(req,res){
   // req.body.blog.body = req.sanitizer(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
        if(err){
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//Delete Blog
app.delete("/blogs/:id", function(req, res){
	//destroy blog
	blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	})
	//redirect somewhere
})
// Takes if wrong path is used
app.get("*",function(req,res){
    res.send("YOU ARE DEAD");
});

app.listen(2000,function(){
    console.log("SERVER HAS STARTED");
    });