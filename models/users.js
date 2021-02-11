const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    address: String,
    age: { type: Number, required: true, min: 16 / 18 },
    gender: String,
    com_points: { type: Number, required: true, default: 0 },
    orders: {
      type: [{ type: Schema.Types.ObjectId, ref: "Order" }],
      default: [],
    },
    designs: {
      type: [{ type: Schema.Types.ObjectId, ref: "Design" }],
      default: [],
    },
    votes: {
      type: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
      default: [],
    },
    currentCart: {
        type: [{id:{ type: Schema.Types.ObjectId, ref: "Vote" }, quantity: Number}],
        default: [],
      },
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
//                           User -->  users
const User = mongoose.model("User", userSchema);

// EXPORT
module.exports = User;
