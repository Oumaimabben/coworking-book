import User from "../models/User.js";
import bcrypt from "bcryptjs"; //pour le chiffrement
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken"; // gestion des jetons

//REGISTER
export const register = async(req,res,next)=>{
    try{
        const salt = bcrypt.genSaltSync(10);  // Génération du salt pour le hachage du mp
        const hash = bcrypt.hashSync(req.body.password, salt); //hashage du mp
        //create new user
        const newUser = new User ({
            username:req.body.username,
            email:req.body.email,
            password: hash,
        })
        //save
        await newUser.save()
        res.status(200).send("user created")

    }catch(err){
        next(err)
    }
}
//LOGIN
export const login = async(req,res,next)=>{
    try{
        const user = await User.findOne({ username: req.body.username }); //recherche user dans BD
        if (!user) 
        return next(createError(404, "User not found!")); //verification user
         //verification mp
        const isPasswordCorrect = await bcrypt.compare(
          req.body.password,
          user.password
        ); 
        if (!isPasswordCorrect)
          return next(createError(400, "Wrong password or username!"));
          //creation token
          const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT
          );
          const { password, isAdmin, ...otherDetails } = user._doc;
          // Définition d'un cookie contenant le jeton d'accès
          res.cookie("access_token", token, {
              httpOnly: true, // acces cote serveur cote securite
            })  

       res.status(200).
       json({ details: { ...otherDetails }, isAdmin });
    }catch(err){
        next(err);
      } }
//LOGOUT
 export const logout = async(req,res,next)=>{
      try {
          // Effacer le cookie contenant le jeton d'accès
          res.clearCookie("access_token");
          res.status(200).send("Logged out successfully");
      } catch(err) {
          next(err);
      }
  }
    

