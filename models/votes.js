const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
const voteSchema = new Schema(
  {
    userId : { type: Schema.Types.ObjectId, ref: "User" },
    designId : { type: Schema.Types.ObjectId, ref: "Design" },
    rating : { type: Number, required: true, default: 0 }
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
//                           Vote -->  votes
const Vote = mongoose.model("Vote", voteSchema);

// EXPORT
module.exports = Vote;