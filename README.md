# Bus-Ticket-Booking(Hyperverge Assignment)

Hosted on AWS, url : http://18.218.72.198:80/

**APIs**

**GET '/users'**
* *Get the list of the users*
* returns:
200: if success and list of users.
400: if fails, returns an error message.

**POST '/users/'**
* *Creates a user*
* *All the attributes are required*
* payload:
* {
	"username" , "fullname" , "phone" , "email"
}
* returns:
200: if success, return object that was saved.
400: if fails, return an error message.

**GET '/tickets/insert'**
* *Inserts the tickets into db with is_open : true(not booked)(Seat Number : 1 to 40)*
* returns:
200: if success with an success message
400: if fails with an error message

**GET '/tickets/closed'**
* *Get a list of tickets which have is_open: false, that is, are closed*
* returns:
200: if success, returns list of ticket objects
404: if fails returns error message.

**GET '/tickets/open'**
* *Get a list of tickets which have is_open: true, that is, are open*
* returns:
200: if success, returns list of ticket objects
404: if fails returns error message.

**GET '/tickets/:seat_number'**
* *Get the status of the seat having seat number as the parameter(in the URL)*
* returns:
200: if success, with the object of the ticket.
400: if error occurs with the message.

**POST '/tickets/booking'**
* *Creates a seat booking.*
* *All attributes are required*
* payload:
* {
	"username", "seat_number"
}
* Changes the status of the seat having the seat number same as given in payload to closed(is_open = false),if not already booked, and adds user_id corresponding to username provided, if user exists.
* returns:
200: if sucess, with the object of the ticket.
400: if fails, with an error message.

**POST '/tickets/:seat_number'**
* *Updates the ticket status.*
* payload: 
* {
	"is_open" : true/false, "username": (if is_open == false, then required, else not)
}
* Updates the status of the seat(seat number provided in the url), if is_open = true, then opens the ticket(mark as unbooked), else changes is_open to false and adds user id to that seat.
* returns:
200: if success, with the object of the ticket.
400: if fails with an error message.

**GET '/tickets/user_details/:seat_number'**
* *Get the user details of the ticket based on the seat_number, if the seat is booked.*
* returns:
200: if success, return the user object or {"message": "Seat is not booked"}, if the seat is not booked yet.
400: if fails with an error message.

**POST '/tickets/admin/reset'**
* *Opens all the seats in the ticket db*
* *sets is_open:true in all the documents in ticket collection.*
* payload:
* {
	"username": "hyperverge",
	"password": "hyperverge"
}
* returns:
200: if success, with an success message.
400: if fails with an error message.

**Schema**
* *Ticket collection*
{
	seat_number: { type: Number, min: 1, max: 40, required: true},
	is_open: {type: Boolean, default: true},
	date: { type: Date, default: Date.now() },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}

* *User collection*
{
	username: { type: String, unique: true, required: 'This field is required.' },
	fullName: String,
	phone: { type: String, unique: true, required: true },
	email: { type: String, unique: true, required: true }
}

* user can be accessed using ticket.user._id

**Packages used**:
**Packages used**:
* "bcrypt": "^3.0.7" -> used for hashing and comparing passwords
* "body-parser": "^1.19.0" -> used for parsing the req.body as a json
* "express": "^4.17.1" -> for API building blocks
* "joi": "^14.3.1" -> Input validation
* "mongoose": "^5.8.1" -> MongoDB ORM
* "mongoose-unique-validator": "^2.0.3" -> used for maintaining unique phone number and email in user documents in the user collection.
