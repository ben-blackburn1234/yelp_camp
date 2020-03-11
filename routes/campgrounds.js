var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			//rendering the campgrounds.ejs page //campgrounds: annd currentUser: is the name used in the index ejs file
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
		}
	})
	
});

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	// res.send("you hit the post route");
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: desc, author:author}
	// campgrounds = the array var = campgrounds
	// campgrounds.push(newCampground); colt delted but i commented out for referrence
	
	//Create new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page
			//using redirect defaults to a get request
			res.redirect("/campgrounds");
		}
	})
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//Shows more info about one campground
router.get("/:id", function(req, res){
	//find the campground with provided id within mongo db
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err) {
			console.log(err);
		} else {
			console.log(foundCampground);
		//render show template with that campground
		res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
				res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			//redirect somewhere(show page)
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Destroy Campgorund route
 router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	 Campground.findByIdAndRemove(req.params.id, function(err){
		 if(err){
			 res.redirect("/campgrounds");
		 } else {
			 res.redirect("/campgrounds");
		 }
	 })
 });


module.exports = router;