const Order = require("../models/orderModel");
const OrderItem = require("../models/order-item");

// post order

exports.postOrder = async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderItemIdResolved = await orderItemsIds;

  const TotalPrices = await Promise.all(
    orderItemIdResolved.map(async (orderId) => {
      const itemOrder = await OrderItem.findById(orderId).populate(
        "product",
        "product_price"
      );

      const total = itemOrder.quantity * itemOrder.product.product_price;
      return total;
    })
  );
  const TotalPrice = TotalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemIdResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    totalPrice: TotalPrice,
    phone: req.body.phone,
    user: req.body.user,
  });

  order = await order.save();
  if (!order) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
  res.send(order);
};

// order list
exports.orderList  = async(req,res)=>{
  const order= await Order.find().populate("user" , "name").sort({dateOrdered:-1})

  if(!order){
    return res.status(400).json({error:"Something Went Wrong"})
  }
  return res.send(order)
}

// exports orderDetail

exports.orderDetail = async(req,res)=>{
  const  order = await Order.findById(req.params.id).populate("user", "name").populate({
    path:"orderItems",populate:{
      path:"product",populate:"category"
    }
  })
  if(!order){
    return res.status(400).json({error:"Something Went Wrong"})
  }
  return res.send(order)
}

// update status
exports.updateStatus = async(req,res)=>{
  const order = await Order.findByIdAndUpdate(req.params.id,{
    status:req.body.status
  },{new:true})
  if(!order){
    return res.status(400).json({error:"Something Went Wrong"})
  }
  return res.send(order)
}

// user orderList
exports.userOrders = async(req,res)=>{
  const userOrderList = await Order.find({user:req.params.user}).populate({
    path:"orderItems",populate:{
      path:"product",populate:"category"
    }
  })
  .sort({dateOrdered:-1})

  if(!userOrderList){
    return res.status(400).json({error:"Something Went Wrong"})
  }
  return res.send(userOrderList)
}

// delete order


exports.deleteOrder = async(req,res)=>{
  let deleteOrder = await Order.findByIdAndRemove(req.params.id)

  if(deleteOrder){
      deleteOrder.orderItems.map(async (orderItem)=>{
        orderItem.findByIdAndRemove(orderItem)
      })
      return res.status(200).json({message:"Order has been deleted"})
  }else return res.status(400).json({error:"Failed to delete Order"})
}
