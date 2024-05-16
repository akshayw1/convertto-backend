//create app done
//delete app
//customised app by id
//save app
//genrate config file

//building app on server side
import prisma from "../lib/prisma.js";

export const createApp = async (req, res) => {
  const data = req.body;
  const tokenUserId = req.userId;
  try {
    const app = await prisma.app.create({
      data: {
        userId: tokenUserId,
        ...data,
      },
    });

    await prisma.user.update({
      where: {
        id: tokenUserId
      },
      data: {
        appCount: {
          decrement: 1
        }
      }
    });

    res.status(200).json({ message: "App created Successfully", app });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while create app" });
  }
};

export const getAppforUser = async( req,res)=>{
    const tokenUserId = req.userId;
    try{
        const userApps = await prisma.app.findMany({
            where:{
                userId:tokenUserId
            }
        })

        res.status(200).json({data:userApps})
    }catch(error){
        console.error(error);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching apps for user" });
    }
}

export const deleteApp = async (req, res) => {
  const appId = parseInt(req.params.id);
  const tokenUserId = req.userId;

  try {
    const app = await prisma.app.findUnique({
      where: {
        id: appId
      },
    });

    if (!app) {
      console.log("App not found");
      return res
        .status(500)
        .json({ error: "An error occurred while delete app, App not found" });
    }

    if (tokenUserId !== app.userId) {
      return res
        .status(403)
        .json({
          message: "An error occurred while delete app, Not authorised",
        });
    }

    await prisma.app.delete({
      where: {
        id: appId,
      },
    });

    res.status(200).json({ message: "App deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while delete app" });
  }
};



