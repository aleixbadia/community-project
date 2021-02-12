const mongoose = require("mongoose");
const User = require("./../../models/users");
require("dotenv").config();

const users = [
  {
    email: "julian@test.com",
    password: "julian123",
    name: {
      firstName: "Julián",
      lastName: "Abasolo",
    },
    age: 25,
    gender: "male",
    picture:
      "data:image/jpeg;base64,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",
    com_points: 100,
    address: {
      street: {
        number: 96,
        name: "Carrer Pamplona",
      },
      city: "Barcelona",
      state: "Barcelona",
      country: "Spain",
      postcode: 08018,
      coordinates: {
        latitude: "41.39774",
        longitude: "2.19019",
      },
    },
    orders: [],
    designs: [],
    votes: [],
    currentCart: [],
  },
  {
    email: "karl.johnson@example.com",
    password: "lovelove",
    name: {
      firstName: "Karl",
      lastName: "Johnson",
    },
    age: 52,
    gender: "male",
    picture: "https://randomuser.me/api/portraits/med/men/6.jpg",
    com_points: 0,
    address: {
      street: {
        number: 6057,
        name: "Avondale Ave",
      },
      city: "New York",
      state: "New York",
      country: "United States",
      postcode: 12564,
      coordinates: {
        latitude: "88.9222",
        longitude: "-82.9558",
      },
    },
    orders: [],
    designs: [],
    votes: [],
    currentCart: [],
  },
  {
    email: "karl.johnson@example.com",
    password: "cygnus",
    name: {
      firstName: "Finn",
      lastName: "Morris",
    },
    age: 24,
    gender: "male",
    picture: "https://randomuser.me/api/portraits/med/men/64.jpg",
    com_points: 10,
    address: {
      street: {
        number: 7130,
        name: "The Strand",
      },
      city: "New Plymouth",
      state: "Nelson",
      country: "New Zealand",
      postcode: 21728,
      coordinates: {
        latitude: "-87.2603",
        longitude: "-154.9263",
      },
    },
    orders: [],
    designs: [],
    votes: [],
    currentCart: [],
  },
];

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
    // 3. CREATE THE USER DOCUMENTS
    const pr = User.create(users);
    return pr;
  })
  .then((createdUsers) => {
    console.log(`Created ${createdUsers.length} users.`);
    mongoose.connection.close();
  })
  .catch((err) => console.log("Error connection to the DB", err));

//node .bin/seeds/seed.js
