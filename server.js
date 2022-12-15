const express = require("express");
const app = express();
require("dotenv").config();

require("./database/connection");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const morgan = require("morgan");
const cors = require("cors")

const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoute");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoute");
const paymentRoutes = require("./routes/paymentRoute")

// middleware
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/public/uploads", express.static("public/uploads"));
app.use(cookieParser());
app.use(cors())

// routes middleware
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes)

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server started at port ${port}`);
});