const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.addWelcomeUserMessage = functions.auth.user().onCreate(async (user) => {
  console.log('A new user signed in for the first time.');
  const fullName = user.displayName || 'Anonymous';

  await admin.firestore().collection('testFunctions').add({
    email: user.email,
    user: fullName,
    text: `User signed in for the first time! Welcome!`,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('Welcome message written to database.');
});

exports.addDeleteUserMessage = functions.auth.user().onDelete(async (user) => {
  console.log('User deleted.');
  const fullName = user.displayName || 'Anonymous';

  await admin.firestore().collection('testFunctions').add({
    email: user.email,
    user: fullName,
    text: `User deleted`,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('Message written to database.');
});

exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  const stripe = require('stripe')(functions.config().stripe.secret_key);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: 'https://template-vue3.web.app/#/calendar',
    cancel_url: 'https://template-vue3.web.app/#/rooms',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: (20) * 100, // 2000 = 20 USD
        },
        quantity: 1,
      },
    ],
  });

  return {
    id: session.id,
  };
});
