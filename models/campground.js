var mongoose = require("mongoose");
//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
                //ref refers to the model that we will refer to with this objectid
            ref: "User"
        },
        username: String
    }
});

//COMPILE SCHEMA INTO A MODEL(the name of our model "Campground" will be pluralized to "campgrounds" and shown in collections.)
module.exports = mongoose.model("Campground", campgroundSchema);