const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Recipe = require ('./models/Recipe');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


//NB: the password has to be encoded if it contains any special characters ::https://www.url-encode-decode.com/				
mongoose.connect("mongodb+srv://admin:%40%24%24mon254@admin-dzypr.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true})
	.then(()=> {
		console.log("successfully logged in");
	})
	.catch((error)=> {
		console.log("unable to connect to mongo");
		console.log(error);

	})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/recipes',(req,res,next)=> {
	const recipe = new Recipe();
	recipe.title = req.body.title;
	recipe.ingredients = req.body.ingredients;
	recipe.instructions = req.body.instructions;		          
	recipe.difficulty = req.body.difficulty;
	recipe.time = req.body.time;
	recipe.id = req.params._id;

	recipe.save().then(()=> {
		res.status(201).json({
			message: "recipe saved successfully"
		})
	}).catch((error)=> {
		res.status(400).json({
			error: error
		})
	})

});

app.get('/api/recipes/:id',(req,res,next)=> {
	Recipe.findOne({
		_id: req.params.id
	}).then((thing)=> {
		res.status(200).json(thing)
	}).catch((error)=> {
		res.status(400).json({
			error: error
		})
	})
});

app.put('/api/recipes/:id',(req,res,next)=> {
	const recipe  = new Recipe({
		title: req.body.title,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions,
		difficulty: req.body.difficulty,
		time: req.body.time,
		_id: req.params.id
	});

	Recipe.updateOne({_id:req.params.id},recipe).then(()=>{
		res.status(201).json({
			message : 'updated successfully'
		})
	}).catch((error)=> {
		res.status(400).json({
			error : error
		})
	})
});


app.delete("/api/recipes/:id",(req,res,next)=> {
	Recipe.deleteOne({_id:req.params.id}).then(()=>{
		res.status(200).json({
			message: 'deleted'
		})
	}).catch((error)=> {
		res.status(400).json({
			error : error
		})
	})
})



app.get('/api/recipes',(req,res,next)=> {
	Recipe.find().then((things)=> {
		res.status(200).json(things)
	}).catch((error)=>{
		res.status(400).json({
			error: error
		})
	})

});







module.exports = app;