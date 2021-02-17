require('dotenv').config();
const express = require('express');
const stripeRouter = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require("./../models/users");

stripeRouter.post('/create-checkout-session/:userId', async (req, res) => {    
    const user = await User.findById(req.params.userId).populate('currentCart.designId');
    // get the cart info of the user and update the line_items

    const itemsToCharge = user.currentCart.map((item)=>{
        const itemObj = {
            price_data: {
                currency: 'eur',
                product_data: {
                  name: item.designId.name,
                  images: [ item.designId.url ],
                },
                unit_amount: item.designId.price * 100,
              },
              quantity: item.quantity,
        }
        return itemObj;
    })
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: itemsToCharge,
      mode: 'payment',
      success_url: `${process.env.YOUR_DOMAIN}/checkout`,
      cancel_url: `${process.env.YOUR_DOMAIN}/cancel`, // TODO
    });

    // empty the user cart 

    res.json({ id: session.id });
  });

  module.exports = stripeRouter;