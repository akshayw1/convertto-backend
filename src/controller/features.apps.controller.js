//create app done
//delete app
//customised app by id
//save app
//genrate config file

//building app on server side

import prisma from "../lib/prisma.js";

export const addfeatures = async (req, res) => {
  const { name: featureName } = req.body;
  const { options: featureCustomisation } = req.body;
  const tokenUserId = req.userId;
  const appId = parseInt(req.params.appId);
  try {
    const app = await prisma.app.findUnique({
        where: { id: appId },
      });
  
      if (!app) {
        return res.status(404).json({ error: "App not found" });
      }

      if(tokenUserId !== app.userId){
        return res.status(200).json({message:"You are not allowed to add features in other apps"})
      }
  
      // Check if the feature already exists for the given app ID
      const existingFeature = await prisma.features.findFirst({
        where: { name: featureName, appId: appId },
      });
  
      let feature;
      if (existingFeature) {
        // If the feature already exists, update it
        feature = await prisma.features.update({
          where: { id: existingFeature.id },
          data: {
            customization: {
              screens: req.body.screencount || 1,
              options: featureCustomisation,
            },
          },
        });
      } else {
        feature = await prisma.features.create({
          data: {
            name: featureName,
            customization: {
              screens: req.body.screencount || 1,
              options: featureCustomisation,
            },
            app: { connect: { id: appId } },
          },
        });
      }
  
      res.status(200).json({
        message: `${featureName} successfully added in ${app.app_name}`,
        feature,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `An error occurred while adding ${featureName} to App` });
  }
};

// Insert or Updates

export const getFeaturesByApp = async (req, res) => {
  const appId = parseInt(req.params.appId);
  const tokenUserId = req.userId;
  
  try {
    const appFeatures = await prisma.features.findMany({
      where: {
        appId: appId,
      },
    });

    // if(tokenUserId !== app.userId){
    //   return res.status(200).json({message:"You are not allowed to see features in other apps"})
    // }


    res.status(200).json({ appFeatures });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: `An error occurred while featching for App` });
  }
};


// Genrate Config Json

export const generateConfigjson = async (req,res) => {
    const appId = parseInt(req.params.appId);
    try{
        const featureToGenerate = await prisma.features.findMany({
            where:{
                appId: appId 
            },
            select:{
                name:true,
                customization:true
                
            }
        })

        const config = featureToGenerate.map(feature=>{
            return {
                [feature.name]: {
                    options: feature.customization.options,
              }
            }; 
            
        })
        res.status(200).json({appId,config})
    }catch(error){
        console.error(error);
        return res
          .status(500)
          .json({ error: `An error occurred while Generating Json for App` });
    }
}
