const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));
