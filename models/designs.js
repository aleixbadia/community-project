const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
const designSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    url: { type: String, required: true }, //cloudinary
    name: { type: String, required: true },
    description: { type: String, required: true },
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
//                           Design -->  designs
const Design = mongoose.model("Design", designSchema);

// EXPORT
module.exports = Design;
