const db = require("../models");
require('dotenv').config();
const Stripe = require('stripe');

const Op = db.Sequelize.Op;

exports.create = async (req, res)  =>  {
  const secret_key = process.env.STRIPE_SECRET_KEY;

  const stripe = new Stripe(secret_key, {
    apiVersion: '2020-08-27',
    typescript: false,
  });

  // Here, we're getting latest customer only for example purposes.
  const customer = await stripe.customers.create({email: req.body.email});

  if (!customer) {
    return res.send({
      error: 'You have no customer created',
    });
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2020-08-27' }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    customer: customer.id,
    shipping: {
      name: req.body.name,
      address: {
        state: 'Victoria',
        city: 'Melbourne',
        line1: '1 Swaston Street',
        postal_code: '8000',
        country: 'AU',
      },
    },
    // Edit the following to support different payment methods in your PaymentSheet
    // Note: some payment methods have different requirements: https://stripe.com/docs/payments/payment-methods/integration-options
    payment_method_types: [
      'card',
      // 'ideal',
      // 'sepa_debit',
      // 'sofort',
      // 'bancontact',
      // 'p24',
      // 'giropay',
      // 'eps',
      // 'afterpay_clearpay',
      // 'klarna',
      // 'us_bank_account',
    ],
  });
  return res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
};
