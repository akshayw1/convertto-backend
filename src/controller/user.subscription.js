import prisma from "../lib/prisma.js";
import { createStripeSession } from "../utils/payment.utils.js";
import { stripe } from "../utils/stripe.js";

export const addSubcriptionToUser = async (req, res) => {
  const { userId: tokenUserId } = req;
  const userId = tokenUserId;
  const planId = parseInt(req.params.id);
  let user;
  //   let plan;
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

    let plan = await prisma.plan.findUnique({
      where: {
        id: planId,
      },
    });
    if (!plan) {
      return res.status(422).json({ message: "User does not exist" });
    }

    const payment = await prisma.payments.create({
      data: {
        status: "pending",
        userId: userId,
        planId: planId,
      },
    });

    console.log("Payment have been saved successfully");

    const customer = await stripe.customers.create({
      name: user.first_name,
      email: user.email,
      metadata: {
        plan: plan.id,
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
      session,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        error: `An error occurred while creating checkout session`,
        error,
      });
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

      const payId = customer.metadata.paymentId;

      const payment = await prisma.payments.findUnique({
        where: {
          id: payId,
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
        where: { id: payment.userId },
        data: {
          subscribedPlan: { connect: { id: payment.planId } },
          subscriptionEnd: new Date(
            Date.now() + planDuration * 24 * 60 * 60 * 1000
          ),
        },
      });

      const paymentStatus = "success";
    console.log(paymentId);
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

export const stripeCancel = (req, res) => {
  return res.status(200).json({ message: "Payment canceled" });
};
