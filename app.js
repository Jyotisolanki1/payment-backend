const express = require('express');
const cors  = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe')('sk_test_51KpsysSCaYKuQ8R96P4ur0XmSh46uKHJ1N1HlE8khhKbHCsxlgwVkOmva3BNOXj0rohq7WxwTjJV15lH9nhtsXHf005wQQWFbt');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

// checkout api
app.post("/api/create-checkout-session",async(req,res)=>{
    const {products} = req.body;


    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:product.dish,
                images:[product.imgdata]
            },
            unit_amount:product.price * 100,
        },
        quantity:product.qnty
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:`${process.env.CLIENT_DOMAIN}/sucess`,
        cancel_url:`${process.env.CLIENT_DOMAIN}/cancel`
    });

    res.json({id:session.id})
 
})


app.listen(port,()=>{
    console.log(`your application running on port number ${port}`)
})