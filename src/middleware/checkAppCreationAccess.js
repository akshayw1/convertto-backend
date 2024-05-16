import prisma from "../lib/prisma.js";

export const checkAppCreationAccess = async (req, res, next) => {
  const tokenUserId = req.userId;
  const { app_type } = req.body;
  console.log(app_type);
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: tokenUserId,
      },
    });
    if (!user.subscribedPlanId) {
      return res
        .status(200)
        .json({ message: "You are not subscribed to any plan" });
    }

    if(!user.appCount ){
        return res.status(200).json({message: "You have reached your app limit"})
    }
    const plan = await prisma.plan.findUnique({
      where: {
        id: user.subscribedPlanId,
      },
    });

    if(user.subscribedPlanId){
        if (app_type == "android") {
            if (plan.android) {
              // User has access to create an app
              next();
            } else {
              return res
                .status(403)
                .json({ error: "You don't have permission to create an android app." });
            }
          } else if (app_type == "ios") {
            if (plan.ios) {
              next();
            } else {
              return res
                .status(403)
                .json({ error: "You don't have permission to create an ios app." });
            }
          }
    }
  
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
