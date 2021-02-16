const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    cart: [
      {
        designId: { type: Schema.Types.ObjectId, ref: "Design" },
        quantity: Number,
      },
    ],
  },
  {
    timestamps: {
      // https://mongoosejs.com/docs/guide.html#timestamps
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// CREATE MODEL
//                          Order -->  orders
const Order = mongoose.model("Order", orderSchema);

// EXPORT
module.exports = Order;
