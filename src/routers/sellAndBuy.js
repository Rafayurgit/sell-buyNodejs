const express = require("express");
const sellBuy= require("../mongoose/models/sellBuy")

// setting up the router

const sellAndBuyRouter = new express.Router();

// code goes here for routes
sellAndBuyRouter.get("/sellProduct", async(req, res)=>{
    try {
        const {product, sortBy}= req.query;
        let sortByOptions={}
        let query={}
        if(product){
            query.productName= product;
        }

        if(sortBy){
            switch(sortBy){
                case "lowerCostPrice":
                    sortByOptions={costPrice : 1}
                    break;
                case "higherCostPrice":
                    sortByOptions={costPrice: -1}
                    break;
                case "lowerSoldPrice":
                    sortByOptions={soldPrice: 1}
                    break;
                case "higherSoldPrice":
                    sortByOptions={soldPrice: -1}
                    break;
                default:
                    return res.status(400).json({error: "Invalid sortByParameters"})
            }
        }
        const data = await sellBuy.find(query).sort(sortByOptions)
        res.send(200).json(data);

    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

sellAndBuyRouter.post("/sellProduct", async(req, res)=>{
    try{
        if(req.body.productName.length < 4){
            return res.send(400).json({error: "product name should have minimum of four characters"})
        }else if(req.body.costPrice <=0 ){
            return res.send(400).json({error: "cost price value cannot be zero or negative value"})
        }
        const data = new sellBuy({productName: req.body.productName, costPrice: req.body.costPrice})
        await data.save();
        res.status(201).json({message: "Product Added"})

    }catch(error){
        res.status(400).json({error: error.message})
    }
})

sellAndBuyRouter.patch("/sellProduct:id", async(req, res)=>{
    try {
        const id= req.param;
        const soldPrice= req.body;
        if(soldPrice<1){
            return res.status(400).json("sold price value cannot be zero or negative value")
        }
        const data = await sellBuy.findByIdAndUpdate(id, {soldPrice}, {new:true, runValidators:true})
        if(!data){
            res.status(400).json({error: "Product not found"})
        }
        return res.status(200).json({message: "Updated Successfully", data:data});
    } catch (error) {
        res.status(400).json({error: error.message})
    }

})

sellAndBuyRouter.delete("/sellProduct:id", async(req, res)=>{
    try {
        const id = req.param;
        const data= await sellBuy.findByIdAndDelete(id)
        if(!data){
            return res.status(400).json({message:"product not found"})
        }
        res.status(200).json({message:"Deleted successfully"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

// exporting the router

module.exports = sellAndBuyRouter;