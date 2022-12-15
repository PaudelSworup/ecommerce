const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)


// process payement
exports.processPayment = async(req,res)=>{
    const paymentIntent = await  stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"npr",

        metadata:{integration_check:"accept_a_payment"}
    })
    res.json({
        client_secret:paymentIntent.client_secret
    })
}

//send stripe api key to frontend

exports.sendStripeApi = async(req,res)=>{
    res.status(200).json({
        stripeApiKey:process.env.STRIPE_API_KEY
    })
}