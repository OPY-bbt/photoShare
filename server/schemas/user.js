const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');
const SALT_WORK_FACTOT = 10;

const UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	works: [String],
	sex: String,
	qq: Number,
	description: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

UserSchema.pre('save', function (next) {
	console.log(this);
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else {
		this.meta.updateAt = Date.now();
	}

	next();
})

UserSchema.methods = {
	comparePassword: function(_password, cb) {
		let isMatch = _password == this.password ? true : false;
		cb(null, isMatch);
	}
}

UserSchema.statics = {
	fetch: function (cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function (id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb)
	}
}

module.exports = UserSchema;