const mongoose = require("mongoose");
const Order = require("../../models/orders");
require("dotenv").config();

const orders = [
    {
        userId: "",
        cart: [{id:"", quantity: 1}]
    },
    {
        userId: "",
        cart: [{id:"", quantity: 2}]
    },
    {
        userId: "",
        cart: [{id:"", quantity: 3}]
    }
]

// MONGOOSE CONNECTION
// 1. CONNECT TO DB
mongoose
  .connect("mongodb://localhost/community_project", { useNewUrlParser: true })
  .then((db) => {
    // 2. DROP THE DATABASE TO CLEAR IT
    console.log("Connected to the DB");
    const pr = db.connection.dropDatabase();
    return pr;
  })
  .then(() => {
    // INSERT THE DATA TO DB (RUN THE SEED)
    // 3. CREATE THE DESIGN DOCUMENTS
    const pr = Order.create(orders);
    return pr;
  })
  .then((createdOrders) => {
    console.log(`Created ${createdOrders.length} orders.`);
    mongoose.connection.close();
  })
  .catch((err) => console.log("Error connection to the DB", err));

//node .bin/seeds/seed.js