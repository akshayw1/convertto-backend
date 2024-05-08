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

    res.status(200).json({ message: "App created Successfully", app });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while create app" });
  }
};

export const deleteApp = async (req, res) => {
  const {id:appId} = req.params;
  const userId = req.body;

  try {
    const app = await prisma.app.findUnique({
      where: {
        id: appId,
      },
    });

    if (!app) {
      console.log("App not found");
      return res
        .status(500)
        .json({ error: "An error occurred while delete app, App not found" });
    }

    if (userId !== app.userId) {
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
      .json({ error: "An error occurred while create app" });
  }
};


const addfeatures = async = (req,res) =>{
    const featureName = req.body;
    

}