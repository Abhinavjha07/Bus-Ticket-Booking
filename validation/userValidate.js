const Joi = require('joi')

function validateObject(object, schema) {
	let result = null;
	Joi.validate(object, schema, (err, user) => {
		if(err) {
			result = [false, err]
		}
		else {
			result = [true, user]
		}
	})

	return result;
}

function userValidate(user) {
	const userSchema = Joi.object().keys({
		username: Joi.string().trim().min(5).max(20).required(),
		fullName: Joi.string().trim().min(5).max(100),
		phone: Joi.string().trim().max(13).required(),
		email: Joi.string().trim().email().required(),
	});

	return validateObject(user, userSchema)
}


module.exports = {userValidate: userValidate}