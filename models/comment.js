var mongoose = require("mongoose");
//SCHEMA SETUP
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
                //ref refers to the model that we will refer to with this objectid
            ref: "User"
        },
        username: String
    }
});

//COMPILE SCHEMA INTO A MODEL
module.exports = mongoose.model("Comment", commentSchema);