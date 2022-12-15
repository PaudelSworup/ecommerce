const express = require("express");
const { postOrder, orderList, orderDetail, updateStatus, userOrders, deleteOrder } = require("../controllers/orderController");
const { orderValidation, validators } = require("../utils/validator");
const router = express.Router();

router.post("/postorder", orderValidation , validators, postOrder);
router.get("/orderlist", orderList)
router.get("/orderdetails/:id",orderDetail)
router.put("/updatestatus/:id",updateStatus)
router.get("/userorder/:user", userOrders)   //for user only
router.delete("/deleteorder/:id", deleteOrder)

module.exports = router;
