const mongoose = require("mongoose");
const Schema = mongoose.Schema;


//  Creating Schema
const todoSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    added_date : {
        type : Date,
        default : Date.now
    }
});


//  Export Schema
module.exports = Todo = mongoose.model('todo' , todoSchema);    // Exporting by "todo" name