const User = require('../models/User')
const express = require('express');
const router = express.Router();

const createUser = async function(username, fullname, phone, email) {
	console.log(username, fullname, phone, email)
	const user = new User({
		username,
		fullName: fullname,
		phone,
		email
	});

	user.save(function(err, result) {
		if(err) throw err;
		console.log(result);
		return result;
	});


}


router.get('/', (req, res) => {
	User.find({}, (err, user) => {
		if(!err)
			return res.status(200).json(user);
		else console.log(err);
	})
});

router.post('/', (req, res) => {
	var result = createUser(req.body.username, 
		req.body.fullname, req.body.phone, 
		req.body.email);

	if(result)
		res.status(200).json({message : "User has been inserted" + result});
	else res.status(400).json({message : "Error occured" });
})

module.exports = router;




