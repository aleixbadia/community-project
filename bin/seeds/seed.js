const mongoose = require("mongoose");
const User = require("../../models/users");
const Design = require("../../models/designs");
const Vote = require("../../models/votes");
const Order = require("../../models/orders");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

require("dotenv").config();

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
        picture: "https://randomuser.me/api/portraits/med/men/16.jpg",
        com_points: 100,
        address: {
          street: "Carrer Pamplona 96",
          city: "Barcelona",
          state: "Barcelona",
          country: "Spain",
          postcode: 08018,
          coordinates: {
            latitude: "41.39774",
            longitude: "2.19019",
          },
        },
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
          street: "Avondale Ave 6057",
          city: "New York",
          state: "New York",
          country: "United States",
          postcode: 12564,
          coordinates: {
            latitude: "88.9222",
            longitude: "-82.9558",
          },
        },
        currentCart: [],
      },
      {
        email: "finn.morris@example.com",
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
          street: "The Strand 7130",
          city: "New Plymouth",
          state: "Nelson",
          country: "New Zealand",
          postcode: 21728,
          coordinates: {
            latitude: "-87.2603",
            longitude: "-154.9263",
          },
        },
        currentCart: [],
      },
    ];

    // 3. CREATE THE USERS DOCUMENTS
    users.forEach((user) => {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(user.password, salt);

      user.password = hashedPassword;
    });

    const pr = User.create(users);
    return pr;
  })
  .then((createdUsers) => {
    console.log(`Created ${createdUsers.length} users.`);

    const idUser1 = createdUsers[0]._id; //JULIAN ID
    const idUser2 = createdUsers[1]._id; //KARL ID
    const idUser3 = createdUsers[2]._id; //FINN ID
    const ids = [idUser1, idUser2, idUser3];
    return ids;
  })
  .then((ids) => {
    // INSERT THE DATA TO DB (RUN THE SEED)
    const designs = [
      {
        userId: ids[0],
        url:
          "https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.rocdn.com%2Fv2%2F8886092%3Fw%3D1024%26h%3D1024&imgrefurl=https%3A%2F%2Fwww.rageon.com%2Fproducts%2Frupaul-t-shirt-4&tbnid=3SmAIF8_xaDGlM&vet=12ahUKEwiN_Y37tuTuAhUZ-BoKHdOrCvYQMygGegUIARCCAg..i&docid=bLqbz1CKWOj-FM&w=1024&h=1024&q=rupaul%20shirt&ved=2ahUKEwiN_Y37tuTuAhUZ-BoKHdOrCvYQMygGegUIARCCAg",
        name: "RuPaul appreciation T-shirt",
        description:
          "A T-shirt celebrating the one, the only, the legent, the diva",
      },
      {
        userId: ids[1],
        url:
          "https://i.etsystatic.com/13911329/c/772/613/19/118/il/279c7d/2124119324/il_340x270.2124119324_l2gc.jpg",
        name: "Code Mug",
        description:
          "Whenever you're frustrating finding a missing ) or }, just take a sip of tea/coffee and everything is going to be fine",
      },
      {
        userId: ids[2],
        url: "https://i.ebayimg.com/images/g/1UAAAOSwz05b6kGR/s-l300.jpg",
        name: "Old style painting",
        description: "A well done classic is timeless",
      },
    ];

    // 3. CREATE THE DESIGN DOCUMENTS
    const pr = Design.create(designs);
    return pr;
  })
  .then((createdDesigns) => {
    console.log(`Created ${createdDesigns.length} designs.`);

    const idDesign1 = createdDesigns[0]._id; //RUPAUL ID
    const idDesign2 = createdDesigns[1]._id; //MUG ID
    const idDesign3 = createdDesigns[2]._id; //PAINTING ID
    const idUser1 = createdDesigns[0].userId; //JULIAN ID
    const idUser2 = createdDesigns[1].userId; //KARL ID
    const idUser3 = createdDesigns[2].userId; //FINN ID

    // INSERT THE DATA TO DB (RUN THE SEED)
    const votes = [
      {
        userId: idUser1,
        designId: idDesign2,
        rating: 5,
      },
      {
        userId: idUser2,
        designId: idDesign3,
        rating: 4,
      },
      {
        userId: idUser3,
        designId: idDesign1,
        rating: 3,
      },
    ];

    // 3. CREATE THE VOTES DOCUMENTS
    const pr = Vote.create(votes);
    return pr;
  })
  .then((createdVotes) => {
    console.log(`Created ${createdVotes.length} votes.`);

    const idUser1 = createdVotes[0].userId; //JULIAN ID
    const idUser2 = createdVotes[1].userId; //KARL ID
    const idUser3 = createdVotes[2].userId; //FINN ID
    const idDesign1 = createdVotes[2].designId; //RUPAUL ID
    const idDesign2 = createdVotes[0].designId; //MUG ID
    const idDesign3 = createdVotes[1].designId; //PAINTING ID

    // INSERT THE DATA TO DB (RUN THE SEED)
    const orders = [
      {
        userId: idUser1,
        cart: [{ id: idDesign3, quantity: 1 }],
      },
      {
        userId: idUser2,
        cart: [{ id: idDesign1, quantity: 2 }],
      },
      {
        userId: idUser3,
        cart: [{ id: idDesign2, quantity: 3 }],
      },
    ];

    // 3. CREATE THE ORDERS DOCUMENTS
    const pr = Order.create(orders);
    return pr;
  })
  .then((createdOrders) => {
    console.log(`Created ${createdOrders.length} orders.`);
    console.log("DB Creation Fully Ready");
    mongoose.connection.close();
  })
  .catch((err) => console.log("Error connection to the DB", err));

//node .bin/seeds/seed.js
