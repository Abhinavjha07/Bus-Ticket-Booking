const User = require('../models/User')
const express = require('express');
const validation = require('../validation/userValidate')
const router = express.Router();

const userValidate = validation.userValidate

const createUser = async function(username, fullname, phone, email) {
	console.log(username, fullname, phone, email)
	const user = new User({
		username,
		fullName: fullname,
		phone,
		email
	});

	user.save(function(err, result) {
		if(err) return err
		console.log(result);
		return result;
	});


}


router.get('/', (req, res) => {
	User.find({}, (err, user) => {
		if(!err)
			res.status(200).json(user);
		else res.status(400).json({message : "Error occured!!"});
	})
});

router.post('/', (req, res) => {
	const user = {"username" : req.body.username,
	"fullName": req.body.fullname,
	"phone": req.body.phone, 
	"email": req.body.email}

	let [result, data] = userValidate(user)
	if(!result) res.status(404).json({message: data});
	else
	{ 
	User.findOne({"username": req.body.username}, (err, result) => {
		if(result)
			res.status(400).json({message: "User already exists!!"})
		else
		{
			var response = createUser(req.body.username, 
			req.body.fullname, req.body.phone, 
			req.body.email);

			if(response)
				res.status(200).json({message : "User has been inserted " + response});
			else res.status(400).json({message : "Error occured! Username, phone or email is repeated." });
		}
	})
	
}
})

module.exports = router;




