const mongoose = require("mongoose");

//write your code for sellBuySchema collection here - model

const sellBuySchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        minLength: [4, "product name should have minimum of four characters"]
    },
    costPrice: {
        type: Number,
        require: true,
        min: [1, "cost price value cannot be zero or negative value"]
    },
    soldPrice: {
        type: Number,
        min: [1, "sold price value cannot be zero or negative value"]
    }
})

const SellBuy = mongoose.model("SellBuy", sellBuySchema);
module.exports = SellBuy