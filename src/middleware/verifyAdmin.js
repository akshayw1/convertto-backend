import jwt from "jsonwebtoken";

export const verifyAdmin = (req,res,next) =>{
    const token = req.cookies?.token;
    console.log(token);
  
    try{
        if(!token){
            return res.status(401).json({message:"Not Authenticated"});
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
            console.log(payload);
            if (err) {
                return res.status(403).json({ message: "Token is not valid" });
            }
            req.userId = payload.id;
            if(!payload.isAdmin){
                return res.status(404).json({message:"Admin access required"})
            }
            
            next();
        }) 
    }catch(e){
        console.log(e);
        return res.status(500).json({ message: "Something went wrong" });
    }
  

}
 
