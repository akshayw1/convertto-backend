import { stripe } from './stripe.js';

export const createStripeSession = async (lineItems, customer) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    phone_number_collection: {
      enabled: true
    },
    customer: customer.id,
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.PAYMENT_BASE_URL}/api/v1/subscribe/success?paymentId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.PAYMENT_BASE_URL}/cancel`,
    billing_address_collection: 'required',
  });
  return session;
};
