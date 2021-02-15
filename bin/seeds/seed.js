const mongoose = require("mongoose");
const User = require("../../models/users");
const Design = require("../../models/designs");
const Vote = require("../../models/votes");
const Order = require("../../models/orders");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

let userIds = [];
let designIds = [];

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
      {
        email: "federico@test.com",
        password: "123",
        name: {
          firstName: "Federico",
          lastName: "Garcia",
        },
        age: 75,
        gender: "male",
        picture: "https://randomuser.me/api/portraits/med/men/75.jpg",
        com_points: 100,
        address: {
          street: "Carrer Navarra 66",
          city: "Barcelona",
          state: "Barcelona",
          country: "Spain",
          postcode: 08218,
          coordinates: {
            latitude: "41.39774",
            longitude: "2.19019",
          },
        },
        currentCart: [],
      },
      {
        email: "sancho@test.com",
        password: "123",
        name: {
          firstName: "Sancho",
          lastName: "Panza",
        },
        age: 175,
        gender: "male",
        picture: "https://randomuser.me/api/portraits/med/men/20.jpg",
        com_points: 100,
        address: {
          street: "Carrer Mancha 96",
          city: "Barcelona",
          state: "Barcelona",
          country: "Spain",
          postcode: 08818,
          coordinates: {
            latitude: "41.39774",
            longitude: "2.19019",
          },
        },
        currentCart: [],
      },
      {
        email: "julia@test.com",
        password: "123",
        name: {
          firstName: "Julia",
          lastName: "Navarro",
        },
        age: 25,
        gender: "female",
        picture: "https://randomuser.me/api/portraits/med/women/96.jpg",
        com_points: 100,
        address: {
          street: "Carrer Corunya 34",
          city: "Barcelona",
          state: "Barcelona",
          country: "Spain",
          postcode: 08318,
          coordinates: {
            latitude: "41.39774",
            longitude: "2.19019",
          },
        },
        currentCart: [],
      },
      {
        email: "sandra@test.com",
        password: "123",
        name: {
          firstName: "Julián",
          lastName: "Abasolo",
        },
        age: 34,
        gender: "female",
        picture: "https://randomuser.me/api/portraits/med/women/16.jpg",
        com_points: 100,
        address: {
          street: "Carrer Lugo 56",
          city: "Barcelona",
          state: "Barcelona",
          country: "Spain",
          postcode: 08818,
          coordinates: {
            latitude: "41.39774",
            longitude: "2.19019",
          },
        },
        currentCart: [],
      },
      {
        email: "conchita@test.com",
        password: "123",
        name: {
          firstName: "Conchita",
          lastName: "Palotes",
        },
        age: 25,
        gender: "female",
        picture: "https://randomuser.me/api/portraits/med/women/46.jpg",
        com_points: 100,
        address: {
          street: "Carrer Navajas 74",
          city: "Barcelona",
          state: "Barcelona",
          country: "Spain",
          postcode: 08918,
          coordinates: {
            latitude: "41.39774",
            longitude: "2.19019",
          },
        },
        currentCart: [],
      },
      {
        email: "carlota@test.com",
        password: "julian123",
        name: {
          firstName: "Carlota",
          lastName: "Malota",
        },
        age: 29,
        gender: "female",
        picture: "https://randomuser.me/api/portraits/med/women/6.jpg",
        com_points: 100,
        address: {
          street: "Carrer Papallona 24",
          city: "Barcelona",
          state: "Barcelona",
          country: "Spain",
          postcode: 08718,
          coordinates: {
            latitude: "41.39774",
            longitude: "2.19019",
          },
        },
        currentCart: [],
      },
      {
        email: "aleix.284@gmail.com",
        password: "1234",
        name: {
          firstName: "Aleix",
          lastName: "Badia",
        },
        age: 26,
        gender: "male",
        picture: "https://randomuser.me/api/portraits/med/men/56.jpg",
        com_points: 100,
        address: {
          street: "Carrer Constitució 123",
          city: "Barcelona",
          state: "Barcelona",
          country: "Spain",
          postcode: 08318,
          coordinates: {
            latitude: "41.39774",
            longitude: "2.19019",
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
    createdUsers.forEach((user) => {
      userIds.push(user._id);
    });
    console.log(userIds)
    return userIds;
  })
  .then((ids) => {
    // INSERT THE DATA TO DB (RUN THE SEED)
    const designs = [
      {
        userId: ids[0],
        url:
          "https://ih1.redbubble.net/image.1188737524.5961/ur,mask_flatlay_front,product,600x600.u1.jpg",
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
        userId: ids[3],
        url: "https://i.picsum.photos/id/619/500/500.jpg?hmac=NGtxAgAsQGvRr6cQUzK836TwMCx1OYBGwe1j37CXX70",
        name: "Mail box",
        description: "Unexpected letters are so charming",
      },
      {
        userId: ids[4],
        url: "https://i.picsum.photos/id/0/500/500.jpg?hmac=GxFxxOH5UMJ_PdDE2Yn6uUIaPjoc_UEOUOYzwFiTxMw",
        name: "Coffe developer",
        description: "Love coding",
      },
      {
        userId: ids[5],
        url: "https://i.picsum.photos/id/68/500/500.jpg?hmac=pKyI0LMvS_HyH_vx_jWvbwbytO_vxmfxFsrjvX9X5D8",
        name: "Winter by the sea",
        description: "You can find peace in the less expected places",
      },
      {
        userId: ids[6],
        url: "https://i.picsum.photos/id/141/500/500.jpg?hmac=jIMUpJy_Y92XvLIdO1w5U8_7fm2jNQIm9XymCaD1XeQ",
        name: "Boiled eggs",
        description: "One of those moments",
      },
      {
        userId: ids[7],
        url: "https://i.picsum.photos/id/1060/500/500.jpg?hmac=1_Zfj2QnxUoauTpLLb7BO881mQrrsM9pgyEDTuOw-QM",
        name: "Little pleasures",
        description: "Happiness is in our little pleasures",
      },
      {
        userId: ids[8],
        url: "https://i.picsum.photos/id/44/500/500.jpg?hmac=XuitWtjF7_EOYZnnmH9Dx1lqjGoOmF3_aQL8qtBVCqc",
        name: "Summer 1994",
        description: "I didn't know happiness could be pictured",
      },
      {
        userId: ids[9],
        url: "https://i.picsum.photos/id/32/500/500.jpg?hmac=86FEqhvXyxxme4FgaTbH6jvuyREKzGILn-5Ub25aURE",
        name: "What is left behind",
        description: "Change is a constant, and this is what I left behind a long time ago",
      },
      {
        userId: ids[1],
        url: "https://i.picsum.photos/id/757/500/500.jpg?hmac=EwwmT3950su7R_ARfzbUsqubYnt5TnWZRS9zQm36BZA",
        name: "Loving trip",
        description: "Go where love tells you to",
      },
      {
        userId: ids[2],
        url: "https://i.picsum.photos/id/618/500/500.jpg?hmac=-U8GAgEI7ChUZUiD9rdvxo3EGQq0MR81ViM7ze8HDYc",
        name: "Geometric pleasures",
        description: "Picture taken in the British Museum - 2003",
      },
      {
        userId: ids[3],
        url: "https://i.picsum.photos/id/320/500/500.jpg?hmac=2iE7TIF9kIqQOHrIUPOJx2wP1CJewQIZBeMLIRrm74s",
        name: "New beginnings",
        description: "Everyday could be a fresh start, and if not now, when?",
      },
      {
        userId: ids[4],
        url: "https://i.picsum.photos/id/38/500/500.jpg?hmac=P2ck2JJoFY6U4RS1VwfQve2kzwgG-1D_6PwXf-oi5jo",
        name: "Cloud styling",
        description: "Clouds are no longer born, they are made",
      },
      {
        userId: ids[5],
        url: "https://i.picsum.photos/id/439/500/500.jpg?hmac=lj2SoYqYGC6Qd5qEW2YmgyD0qdxf5usiTeuC0RuGemo",
        name: "City sky",
        description: "Picture from my room",
      },
      {
        userId: ids[6],
        url: "https://i.picsum.photos/id/94/500/500.jpg?hmac=fU8eN6t-spj5f3-h0uf4clf5qttgWmR6Z6HwcYnsLlw",
        name: "Summer will come",
        description: "Grass, spring, morning, 2001",
      },
      {
        userId: ids[7],
        url: "https://i.picsum.photos/id/82/500/500.jpg?hmac=SBl_t1w-gmq7jLkcwDJHDQG5MsYX_Pdr3_gTaYW_UaU",
        name: "Sakura",
        description: "Japan has the most beautiful spring of all",
      },
      {
        userId: ids[8],
        url: "https://i.picsum.photos/id/140/500/500.jpg?hmac=5tkI8SHv4r-aBAH_0PdbizD8y-NlYv3POESdyYIMk4o",
        name: "Grow strong",
        description: "All we want for you is to grow strong and in peace",
      },
      {
        userId: ids[9],
        url: "https://i.picsum.photos/id/260/500/500.jpg?hmac=KrCyDoFtAZ6bfs9TSpN-cySHgOentnXIBcRCBbqstHQ",
        name: "Desires",
        description: "Simple desires can change someone's life",
      },
      {
        userId: ids[9],
        url: "https://i.picsum.photos/id/556/500/500.jpg?hmac=QCr9844f3jicoToG31pqMK529sQp6hadIFgyaH-ixeo",
        name: "Old barn and stables",
        description: "Here I spent the best year of my life",
      },
      {
        userId: ids[9],
        url: "https://i.picsum.photos/id/555/500/500.jpg?hmac=fACyyPb_gk0ca06b0o3PREP8DzEICzNBKimKghDZYNo",
        name: "Timeless",
        description: "Playgounds can be found in the less expected places",
      },
    ];

    // 3. CREATE THE DESIGN DOCUMENTS
    const pr = Design.create(designs);
    return pr;
  })
  .then((createdDesigns) => {
    console.log(`Created ${createdDesigns.length} designs.`);

    createdDesigns.forEach((design) => {
      designIds.push(design._id);
    });

    // INSERT THE DATA TO DB (RUN THE SEED)
    const votes = [
      {
        userId: userIds[0],
        designId: designIds[1],
        rating: 1,
      },
      {
        userId: userIds[0],
        designId: designIds[5],
        rating: 1,
      },
      {
        userId: userIds[0],
        designId: designIds[13],
        rating: 1,
      },
      {
        userId: userIds[0],
        designId: designIds[17],
        rating: 1,
      },
      {
        userId: userIds[0],
        designId: designIds[19],
        rating: 1,
      },
      {
        userId: userIds[1],
        designId: designIds[2],
        rating: 1,
      },
      {
        userId: userIds[1],
        designId: designIds[6],
        rating: 1,
      },
      {
        userId: userIds[1],
        designId: designIds[12],
        rating: 1,
      },
      {
        userId: userIds[1],
        designId: designIds[10],
        rating: 1,
      },
      {
        userId: userIds[1],
        designId: designIds[3],
        rating: 1,
      },
      {
        userId: userIds[2],
        designId: designIds[0],
        rating: 1,
      },
      {
        userId: userIds[2],
        designId: designIds[11],
        rating: 1,
      },
      {
        userId: userIds[2],
        designId: designIds[15],
        rating: 1,
      },
      {
        userId: userIds[2],
        designId: designIds[18],
        rating: 1,
      },
      {
        userId: userIds[2],
        designId: designIds[19],
        rating: 1,
      },
      {
        userId: userIds[3],
        designId: designIds[14],
        rating: 1,
      },
      {
        userId: userIds[3],
        designId: designIds[4],
        rating: 1,
      },
      {
        userId: userIds[3],
        designId: designIds[6],
        rating: 1,
      },
      {
        userId: userIds[3],
        designId: designIds[7],
        rating: 1,
      },
      {
        userId: userIds[3],
        designId: designIds[9],
        rating: 1,
      },
      {
        userId: userIds[4],
        designId: designIds[8],
        rating: 1,
      },
      {
        userId: userIds[4],
        designId: designIds[12],
        rating: 1,
      },
      {
        userId: userIds[4],
        designId: designIds[13],
        rating: 1,
      },
      {
        userId: userIds[4],
        designId: designIds[17],
        rating: 1,
      },
      {
        userId: userIds[4],
        designId: designIds[19],
        rating: 1,
      },
      {
        userId: userIds[5],
        designId: designIds[1],
        rating: 1,
      },
      {
        userId: userIds[5],
        designId: designIds[6],
        rating: 1,
      },
      {
        userId: userIds[5],
        designId: designIds[15],
        rating: 1,
      },
      {
        userId: userIds[5],
        designId: designIds[17],
        rating: 1,
      },
      {
        userId: userIds[5],
        designId: designIds[1],
        rating: 1,
      },
      {
        userId: userIds[6],
        designId: designIds[0],
        rating: 1,
      },
      {
        userId: userIds[6],
        designId: designIds[4],
        rating: 1,
      },
      {
        userId: userIds[6],
        designId: designIds[13],
        rating: 1,
      },
      {
        userId: userIds[6],
        designId: designIds[5],
        rating: 1,
      },
      {
        userId: userIds[6],
        designId: designIds[19],
        rating: 1,
      },
      {
        userId: userIds[7],
        designId: designIds[1],
        rating: 1,
      },
      {
        userId: userIds[7],
        designId: designIds[3],
        rating: 1,
      },
      {
        userId: userIds[7],
        designId: designIds[13],
        rating: 1,
      },
      {
        userId: userIds[7],
        designId: designIds[14],
        rating: 1,
      },
      {
        userId: userIds[7],
        designId: designIds[19],
        rating: 1,
      },
      {
        userId: userIds[8],
        designId: designIds[1],
        rating: 1,
      },
      {
        userId: userIds[8],
        designId: designIds[5],
        rating: 1,
      },
      {
        userId: userIds[8],
        designId: designIds[13],
        rating: 1,
      },
      {
        userId: userIds[8],
        designId: designIds[17],
        rating: 1,
      },
      {
        userId: userIds[8],
        designId: designIds[19],
        rating: 1,
      },
    ];

    // 3. CREATE THE VOTES DOCUMENTS
    const pr = Vote.create(votes);
    return pr;
  })
  .then((createdVotes) => {
    console.log(`Created ${createdVotes.length} votes.`);

    // INSERT THE DATA TO DB (RUN THE SEED)
    const orders = [
      {
        userId: userIds[19],
        cart: [{ id: designIds[3], quantity: 1 }],
      },
      {
        userId: userIds[19],
        cart: [{ id: designIds[5], quantity: 2 }],
      },
      {
        userId: userIds[19],
        cart: [{ id: designIds[7], quantity: 3 }],
      },
      {
        userId: userIds[19],
        cart: [{ id: designIds[9], quantity: 3 }],
      },
      {
        userId: userIds[19],
        cart: [{ id: designIds[12], quantity: 3 }],
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

//node bin/seeds/seed.js
