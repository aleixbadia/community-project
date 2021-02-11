# Community Designs (?)



## Description



Platform for uploading, voting and purchasing items with images from user designs (like t-shirts, mugs, etc).
Contains a database with collections for users, designs, votes and purchases linked many to many by ids

- Users
- Designs
- Votes
- Purchases



## User stories



- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault

- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

- **homepage** - As a user I want to be able to access the homepage . 

- **sign up** - As a user I want to sign up on the web page so that I can vote designs.

- **login** - As a user I want to be able to log in on the web page so that I can get back to my account

- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account

- **edit user** - As a user I want to be able to edit my profile.

- **design list** - As a user I want to see the list of designs.

- **buy** - As a user I want to see what items i can purchase and click on them.

- **checkout** - As a user I want to see the card and redirect to payment page.

  

## Server Routes

| **Method** | **Route**                    | **Description**                                              | Request  - Body                                          |
| ---------- | ---------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `GET`      | `/`                          | Main page route.  Renders home `index` view. With links to vote and buy |                                                          |
| `GET`      | `/login`                     | Renders `login` form view.                                   |                                                          |
| `POST`     | `/login`                     | Sends Login form data to the server.                         | { email, password }                                      |
| `GET`      | `/signup`                    | Renders `signup` form view.                                  |                                                          |
| `POST`     | `/signup`                    | Sends Sign Up info to the server and creates user in the DB. | {  email, password  }                                    |
| `GET`      | `/profile/:username`         | Private route. Renders `profile` form view.                  |                                                          |
| `POST`     | `/profile/:username`         | Private route. Sends edit-profile info to server and updates user in DB. | { email, password, [firstName], [lastName], [imageUrl] } |
| `GET`      | `/profile/uploads`           | Private route. Render the `uploads` view with designs by user in DB |                                                          |
| `POST`     | `/profile/uploads/`          | Private route. Adds a new design for the current user.       | { uploaded file }                                        |
| `DELETE`   | `/profile/uploads/:designId` | Private route. Deletes the existing design from the current user. |                                                          |
| `GET`      | `/vote`                      | Renders `design-list` view.                                  |                                                          |
| `GET`      | `/vote/:id`                  | Render `design-details ` view for the particular design.     |                                                          |
| `POST`     | `/vote/:id`                  | Sends`vote-data ` to database.                               |                                                          |
| `GET`      | `/buy/`                      | Render `buy-list ` view for the designs.                     |                                                          |
| `GET`      | `/buy/:id`                   | Render `buy-details ` view for the particular design. Button to add to cart |                                                          |
| `GET`      | `/cart/:id`                  | Redirects to cart.                                           |                                                          |
| `GET`      | `/checkout/:id`              | Form to input pay & delivery info                            |                                                          |
| `POST`     | `/checkout/:id`              | Redirect to pay platform.                                    |                                                          |






## Models & schemas

### Users model

```javascript
{
    _Id : ObjectIdEmail : { type: String, required: true, unique: true },
    Password : { type: String, required: true},
    Name : { type: String, required: true },
    Address : StringAge : { type: Number, required: true, min: 16/18 },
    Gender : String,
    Com_points : { type: Number, required: true, default: 0 },
    Orders : [orderId],
    Designs : [designId],
    Votes : [voteId],
    currentCart : [{designId , quantity}]
}
```

### Designs model

```javascript
{
    _Id : ObjectIdURL : { type: String, required: true, unique: true },
    Orders : [orderId],
    Total_sold : Number,
    Votes : [voteId],
    Total_rating : { type: Number, required: true, default: 0 },
    CreatorId: ObjectId           
}
```

### Orders model

```javascript
{
   _Id : ObjectId,
   BuyerId : ObjectId,
   Cart : [{designId , quantity}],
   Total_value : Number,
   Delivery_adress : String
}
```

### Votes model

```javascript
{
    _id: ObjectId
   VoterId : ObjectId
   DesignId : ObjectId
   Rating : { type: Number, required: true, default: 0 }
}
```



## Backlog

[See the Trello board.](https://trello.com/b/6ZU07s3r/m2project)



## Links

### Git

Url to repository and to deployed project

[Repository Link](https://github.com/aleixbadia/community-project)

[Deploy Link]()

<br>

### Slides

Url to the presentation slides

[Slides Link](https://docs.google.com/presentation/d/1P5FIi0vHZBUcgUtmt1M4_lLCO5dwdJ4UOgtJa4ehGfk/edit?usp=sharing)

