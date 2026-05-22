import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
     
      try {
         
        let {token} = req.cookies;
        if(!token){
            return res.status(401).json({message:"Token not found"});
        }

        let verifyToken =  jwt.verify(token, process.env.JWT_SECRET);

        if(!verifyToken){
            return res.status(401).json({message:"Invalid Token"});
        }

        req.userId = verifyToken.userId;
        next();



      } catch (error) {
          return res.status(500).json({message:`isAuth error ${error.message}`})
      }
    
  };
  
  export default isAuth;