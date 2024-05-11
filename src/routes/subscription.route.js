// subcribed user to plan

import prisma from "src/lib/prisma.js";
import { createStripeSession } from "src/utils/payment.utils";

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

    res
      .status(200)
      .json({
        message: "Creating checkout session successful",
        url: session.url,
        sessionId: session.id,
      });
  } catch (error) {}
};
