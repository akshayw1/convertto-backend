import prisma from '../lib/prisma.js';
import cron from 'node-cron';

// Function to check and update subscriptions
const checkSubscriptions = async () => {
  const now = new Date();
  const users = await prisma.user.findMany({
    where: {
      subscriptionEnd: {
        lte: now
      }
    }
  });

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscribedPlanId: null, // or set to a free plan ID
        subscriptionEnd: null,
        appCount:null
      }
    });
  }
};

// Schedule the cron job to run daily at midnight
cron.schedule('0 0 * * *', checkSubscriptions);

console.log('Subscription checker started');
