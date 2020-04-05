const Ticket = require("../models/Ticket");
const User = require("../models/User");
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const createTicket = async function(seat_number,user) {
	var date = new Date();
	is_open = true;
	const ticket = new Ticket({
		"seat_number" : seat_number,
		"is_open": is_open,
		"date": date,
		"user" : user
	});

	ticket.save(function(err, result) {
		return result;
	});
}



router.get('/insert', (req, res) => {
	for(var i = 1;i<=40;i++) {
		var result = createTicket(i, null);
		if(result) {
			console.log("Ticket inserted!!");
		}
	}

	res.status(400).json({message : "Tickets inserted!!"});
})


function getIdFromUsername(username) {
	User.findOne({ "username" : username }, (err, result) => {
		if(result)
			return result._id;
		else
			console.log(err);
	})
}

router.get('/closed', (req, res) => {
	Ticket.find({"is_open" : false }, (err, ticket) => {
		if(!err) {
			res.status(200).json(ticket);
			
		}

		else {
			res.status(400).json({message : "Error occured in finding closed tickets."})
		}
	})
});

router.get('/open', (req, res) => {
	Ticket.find({"is_open" : true}, (err, ticket) => {
		if(!err) {

			res.status(200).json(ticket);
		}

		else {
			res.status(400).json({message : "Error occured in finding open tickets."})
		}
	})
});

router.get('/status/:seat_number', (req, res) => {
	const { seat_number }  = req.params
	console.log(seat_number);
	Ticket.findOne({"seat_number" : seat_number}, (err, ticket) => {
		if(!err) {
			if(ticket) {
				res.status(200).json(ticket);
			}
			else {
				res.status(200).json({message: "No such ticket exists."})
			}
		}

		else {
			res.status(400).json({message : "Error occured in finding ticket."})
		}
	})
});



router.post('/booking', (req, res) => {
	var username = req.body.username;
	var seat_number = req.body.seat_number;
	User.findOne({"username": username}, (err, result)=> {
		if(err) console.log(err);
		if(result)
		{
			Ticket.findOne({"seat_number": seat_number}, (err, ticket) => {
				if(!ticket.is_open) {
					res.status(400).json({ message : "Error! Seat already booked." });
				}
				else {
					ticket.is_open = false;
					ticket.user = result._id;
					ticket.save((err, ans) => {
						if(err) res.status(404).json({message : "Booking can't be done"});
						else
						{
							res.status(200).json( { message : "Booking has been done!!" + ans} );
						}
					})
					
				}
			})
			
		}
		else
			return res.status(400).json({message :"User doesn't exist."});
	})
})


router.post('/:seat_number', (req, res) => {
	const seat_number = req.params;
	const payload = req.body;
	var user = null;

	if("username" in payload) {
		user = getIdFromUsername(payload.username);
	}

	if(payload.is_open == true)
	{
		Ticket.findOne({ "seat_number": seat_number}, (err, ticket) => {
			if(err) res.status(404).json({ message: err});
			if(ticket) {
				ticket.is_open = true;
				ticket.user = null;
				ticket.save((err, ticket) => {
					if(err) res.status(400).json({message : "Error occured"});
					else res.status(200).json({message : "Ticket is open!!"})
				})

			}
		})
	}

	else if(payload.is_open == false && user != null) {
		Ticket.findOne({ "seat_number": seat_number}, (err, ticket) => {
			if(err) res.status(404).json({ message: err});
			if(ticket) {
				if(ticket.user == null)
				{
					ticket.is_open = false;
					ticket.user = user;
					ticket.save((err, ticket) => {
					if(err) res.status(400).json({message : "Error occured"});
				})
				}

			}
		})

	}
})

router.get('/user_details/:seat_number', (req, res) => {
	const seat_number = req.params.seat_number;
	console.log(seat_number)
	Ticket.findOne({"seat_number" : seat_number}, (err, ticket) => {
		if(err) res.status(400).json( { message: "Error occured in finding ticket with the given seat_number." } );
		else {
			console.log(ticket)
			if(ticket) {
				if(ticket.is_open == true)
					res.status(200).json({message : "Seat is not booked yet!"});
				else {
					var user_id = ticket.user;
					console.log(user_id)
					User.findOne({_id: user_id} , (err, user) => {
						if(err) res.status(400).json({message : "Error occured in finding user!"});
						else res.status(200).json(user);
					});

				}
			}
		}
	});
})


router.get('/admin', (req, res) => {
	if(!("username" in req.body) || !("password" in req.body)) {
		res.status(400).json({message : "Username and Password are required to access it!"});
	}

	const username = req.body.username;
	const password = req.body.password;
	if(username == process.env.USER)
	{
		if(bcrypt.compareSync(password, process.env.PASSWORD)) {
			Ticket.find({"is_open": false} , (err, tickets) => {
				if(tickets) {
					tickets.forEach(ticket => {
						ticket.is_open = false;
						ticket.save((err, result) => {
							if(err) res.status(400).json({message : "Failed to open ticket with seat_number : "+ticket.seat_number});
							else console.log("Opening seat_number : "+ticket.seat_number);
						})
					});

					res.status(200).json({message : "Success"});
				}
				if(err) res.status(400).json("Error occured");
			});
		}
		else
			res.status(400).json({message : "Password doesn't match!!"});

	}
	else
		res.status(400).json({message : "Username incorrect!!"});
});


module.exports = router;
