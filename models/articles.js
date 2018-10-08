//require Mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//create article schema
var articleSchema = new Schema({
    title: {
        type: String,
    },
    link: {
        type: String,
    },
    summary: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//create note model from articleSchema
var Articles = mongoose.model("Articles", articleSchema);

//export the model
module.exports = Articles;