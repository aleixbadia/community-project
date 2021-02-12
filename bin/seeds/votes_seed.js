const mongoose = require("mongoose");
const Vote = require("../../models/users");
require("dotenv").config();

const votes = [
    {
        userId: "602681b1e9804c10876698b4",
        designId: "602681b2e9804c10876698b9",
        rating: 5
    },
    {
        userId: "602681b1e9804c10876698b5",
        designId: "602681b2e9804c10876698b7",
        rating: 4
    },
    {
        userId: "602681b1e9804c10876698b6",
        designId: "602681b2e9804c10876698b8",
        rating: 3
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
    const pr = Vote.create(votes);
    return pr;
  })
  .then((createdVotes) => {
    console.log(`Created ${createdVotes.length} votes.`);
    mongoose.connection.close();
  })
  .catch((err) => console.log("Error connection to the DB", err));

//node .bin/seeds/seed.js