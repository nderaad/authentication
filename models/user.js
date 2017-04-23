var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

//=== This code below adds a bunch passport methods to our UserSchema defined above==//
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
