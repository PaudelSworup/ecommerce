const express= require("express")
const { processPayment, sendStripeApi } = require("../controllers/paymentController")
const { requireSignin } = require("../controllers/userController")
const router = express.Router()

router.post("/processpayment",requireSignin, processPayment)
router.get("/stripeapi", sendStripeApi)




module.exports = router