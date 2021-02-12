const mongoose = require("mongoose");
const Design = require("../../models/designs");
require("dotenv").config();

const designs = [
  {
    userId: "60267e11fc450c0e20b40369",
    url:
      "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.rocdn.com%2Fv2%2F8886092%3Fw%3D1024%26h%3D1024&imgrefurl=https%3A%2F%2Fwww.rageon.com%2Fproducts%2Frupaul-t-shirt-4&tbnid=3SmAIF8_xaDGlM&vet=12ahUKEwiN_Y37tuTuAhUZ-BoKHdOrCvYQMygGegUIARCCAg..i&docid=bLqbz1CKWOj-FM&w=1024&h=1024&q=rupaul%20shirt&ved=2ahUKEwiN_Y37tuTuAhUZ-BoKHdOrCvYQMygGegUIARCCAg",
    name: "RuPaul appreciation T-shirt",
    description:
      "A T-shirt celebrating the one, the only, the legent, the diva",
    orders: [],
    votes: [],
  },
  {
    userId: "60267e11fc450c0e20b4036a",
    url:
      "https://i.etsystatic.com/13911329/c/772/613/19/118/il/279c7d/2124119324/il_340x270.2124119324_l2gc.jpg",
    name: "Code Mug",
    description:
      "Whenever you're frustrating finding a missing ) or }, just take a sip of tea/coffee and everything is going to be fine",
    orders: [],
    votes: [],
  },
  {
    userId: "60267e11fc450c0e20b4036b",
    url: "https://i.ebayimg.com/images/g/1UAAAOSwz05b6kGR/s-l300.jpg",
    name: "Old style painting",
    description: "A well done classic is timeless",
    orders: [],
    votes: [],
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
    // 3. CREATE THE DESIGN DOCUMENTS
    const pr = Design.create(designs);
    return pr;
  })
  .then((createdDesigns) => {
    console.log(`Created ${createdDesigns.length} designs.`);
    mongoose.connection.close();
  })
  .catch((err) => console.log("Error connection to the DB", err));

//node .bin/seeds/seed.js