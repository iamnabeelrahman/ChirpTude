const  mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
    {
        // the channel which is being subscribed
        channel: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },],
        
        // the one who is subscribing
        subscriber: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },],
    }, 
    { timestamps: true }
)

const Subscription = new mongoose.model("Subscription", subscriptionSchema)
module.exports = {
    Subscription
}