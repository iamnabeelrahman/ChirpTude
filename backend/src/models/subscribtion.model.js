const  mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
    {
        // the one who is subscribing
        channel: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },],

        // the channel which is being subscribed
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