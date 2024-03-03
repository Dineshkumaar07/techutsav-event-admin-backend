const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

try {
  mongoose.connect(process.env.DB_URL).then((result) => {
    console.log("DB CONNECTED SUCCESSFULLY");
    app.listen(process.env.PORT, () => {
      console.log("ADMIN SERVER STARTED ON PORT: " + process.env.PORT);
    });
  });
} catch (err) {
  // console.log(err);
}
