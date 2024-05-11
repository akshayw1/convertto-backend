// subcribed user to plan

import prisma from "src/lib/prisma.js";
import { createStripeSession } from "src/utils/payment.utils";
import { stripe } from "src/utils/stripe";

export const addSubcriptionToUser = async (req, res) => {
  const { userId: tokenUserId } = req;
  const userId = tokenUserId;
  const { id: planId } = req.body;
  let user;
  let plan;
  try {
    const existUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!existUser) {
      return res.status(422).json({ message: "User does not exist" });
    } else {
      user = existUser;
    }

    const plan = await prisma.plan.findUnique({
      where: {
        id: planId,
      },
    });
    if (!plan) {
      return res.status(422).json({ message: "User does not exist" });
    } else {
      plan = plan;
    }

    const payment = await prisma.payments.create({
      data: {
        status: "pending",
        user_id: userId,
        plan_id: planId,
      },
    });

    const customer = await stripe.customers.create({
      name: user.first_name,
      metadata: {
        plan: plan,
        paymentId: payment.id,
        name: user.first_name,
      },
    });

    const lineItems = [
      {
        price_data: {
          currency: "inr",
          unit_amount: plan.plan_price * 100,
          product_data: {
            name: plan.plan_name,
          },
        },
        quantity: 1,
      },
    ];

    const session = await createStripeSession(lineItems, customer);

    res.status(200).json({
      message: "Creating checkout session successful",
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `An error occurred while creating checkout session` });
  }
};

export const stripeSuccess = async (req, res) => {
  const { paymentId } = req.query;
  try {
    const data = await stripe.checkout.sessions.retrieve(paymentId);
    if (!data) {
      return res.status(200).json({ message: "Stripe payment Not Found" });
    }

    if (data.payment_status === "paid") {
      const customer = await stripe.customers.retrieve(data.customer);

      const { paymentId } = customer.metadata;

      const payment = await prisma.payments.findUnique({
        where: {
          id: paymentId,
        },
      });
      if (!payment)
        return res.status(404).json({ message: "payment not found" });

      const user = await prisma.user.findUnique({
        where: {
          id: payment.userId,
        },
      });
      if (!user) return res.status(404).json({ message: "user not found" });

      const subscribedPlan = await prisma.plan.findUnique({
        where: {
          id: payment.planId,
        },
      });

      const { planDuration } = subscribedPlan.plan_duration;

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscribedPlan: { connect: { id: payment.planId } },
          subscriptionEnd: new Date(
            Date.now() + planDuration * 24 * 60 * 60 * 1000
          ),
        },
      });

      const paymentStatus = "paid";
      await prisma.payments.update({
        where: { id: paymentId },
        data: {
          status: paymentStatus,
          stripeId: paymentId,
        },
      });

      // eventEmit(knownEvents.SubscriptionCreated, {
      //   userId: user._id,
      //   planId: payment.plan,
      // });

      res.status(201).json({
        message: "You subscription has been created successfully",
        payment: payment.id,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
