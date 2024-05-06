//create app
//delete app
//customised app by id
//save app
//genrate config file 

//building app on server side 
import prisma from "../lib/prisma.js";

export const createApp = async (req,res) =>{
        const data = req.body;
        const tokenUserId = req.userId;
        try{
            const app = await prisma.app.create({
                data:{
                    userId:tokenUserId,
                ...data}
            })

            res.status(200).json({message:"App created Successfully", app})

        }catch(error){
            console.error(error);
            return res
              .status(500)
              .json({ error: "An error occurred while create app" });
        }
}