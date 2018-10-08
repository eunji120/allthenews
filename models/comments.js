//require Mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//create comments schema
var commentSchema = new Schema({
    name: {
        type: String
    },
    comment: {
        type: String
    }
});

//Create Note Model from commentSchema
var Comments = mongoose.model("Comments", commentSchema);

//Export the model
module.exports = Comments;