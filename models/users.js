const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    age: { type: Number, required: true, min: 16 },
    gender: { type: String, required: true },
    picture: { type: String, default: "" },
    com_points: { type: Number, default: 0 },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      country: { type: String, required: true },
      postcode: { type: String, required: true },
      coordinates: {
        latitude: { type: Number, default: 0 },
        longitude: { type: Number, default: 0 },
      },
    },
    currentCart: [
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
//                           User -->  users
const User = mongoose.model("User", userSchema);

// EXPORT
module.exports = User;
