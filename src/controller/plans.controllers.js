//createplan
//update plan
// delete plan
// getplan

import prisma from "../lib/prisma.js";

export const createPlan = async (req, res) => {
  const {
    name: planName,
    android: androidApp,
    ios: iosApp,
    nums_app: numsApp,
    plan_price: planPrice,
    plan_duration: planDuration,
    features: feature,
  } = req.body;
  try {
    const plan = await prisma.plan.create({
      data: {
        plan_name: planName,
        android: androidApp,
        ios: iosApp,
        nums_app: numsApp,
        plan_price: planPrice,
        plan_duration: planDuration,
        features:feature
      },
    });

    res
      .status(200)
      .json({ message: `Plan ${planName} have been added successfully,`, plan });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while create app" });
  }
};


export const getPlan = async (req, res) => {
    const planId = parseInt(req.params.id);
    try {
      const plan = await prisma.plan.findUnique({
       where:{
         id:planId
       }
      });
  
      res
        .status(200)
        .json({ message: `Plan have been Read successfully,`, plan });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "An error occurred while Read app" });
    }
  };
  


export const deletePlan = async (req,res) => {
    const planId = parseInt(req.params.id);
    try{
        const plan = await prisma.plan.findUnique({
            where:{
                id:planId
            }
        })

        if(!plan){
            return res.status(404).json({message:"Plan not found"})
        }

        await prisma.plan.delete({
            where:{
                id:planId
            }
        })

        res.status(200).json({message :`${plan.plan_name} Deleted Successfully`})

    }catch(error){
        console.log(error);
        return res
          .status(500)
          .json({ error: "An error occurred while Delete app" });
    }
}

export const updatePlan = async (req,res) =>{
    const planId = parseInt(req.params.id);
    const {
        name: planName,
        android: androidApp,
        ios: iosApp,
        nums_app: numsApp,
        plan_price: planPrice,
        plan_duration: planDuration,
        features: feature,
      } = req.body;

      try{
        const updatedPlan = await prisma.plan.update({
            where:{
                id:planId
            },
            data:{
                plan_name: planName,
                android: androidApp,
                ios: iosApp,
                nums_app: numsApp,
                plan_price: planPrice,
                plan_duration: planDuration,
                features:feature
            }
            
        })

        res.status(200).json({message :`Updated Successfully`,updatedPlan})

      }catch(error){ 
        console.log(error);
        return res
          .status(500)
          .json({ error: "An error occurred while updating app" });
      }
}

export const getAllPlans = async ( req,res) => {
    try{
        const plans = await prisma.plan.findMany({});
        res.status(200).json({message:"All Plans fetched Successfully",plans})
    }catch(error){
        console.log(error);
        return res
          .status(500)
          .json({ error: "An error occurred while fetching all app" });
    }
}