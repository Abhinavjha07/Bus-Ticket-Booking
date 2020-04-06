# Bus-Ticket-Booking(Hyperverge Assignment)

Hosted on AWS, url : 

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
* *Inserts the tickets into db(Seat Number : 1 to 40)*
* returns:
200: if success with an success message
400: if fails with an error message