/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';
import Stripe from 'stripe';

const stripe = Stripe(
  'pk_test_51OpaGPCfxlqbCMt9zVlVKOoH4OHXJ2XEwSkR50pU4V63kgkNWkOm4hWUFqxIs6RDnGNDWO1HVsJFOdSgMnjuUsHL00DAey9SJB',
);

export const bookTour = async (tourId) => {
  try {
    //get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    //create checkout form + charge credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (error) {
    console.log(error);
    showAlert('error', error.message);
  }
};
