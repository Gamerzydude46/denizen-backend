import { Request, Response, Router } from "express";
import User from "../models/user";
import { checkUserExistence, createUser } from "../services/user.services";
import { denizenDb } from "../services/database.services";
const bcrypt = require('bcrypt');
export const userRouter = Router();

userRouter.post("/create", async (req: Request, res: Response) => {
    const user: User = {
        verified: false,
        email: req.body.email,
        fname: req.body.fname,
        mname: null,
        lname: req.body.lname,
        dob: null,
        gender: null,
        pan: null,
        adhar: null,
        password: await bcrypt.hash(req.body.password,8),
        address: {
            city: null,
            contact: null,
            pincode: null,
            residence: null,
            state: null
        },
        type: req.body.type,
    }

    // Check already exist
    var flag = await checkUserExistence(user.email);
    if (flag === undefined) {
        const userCreation = await createUser(user);
        !userCreation ?
            res.status(500).json({ message: "Error while creating user" }) :
            res.status(200).json({ message: "User account created Succesfully !",flag:true})
    }
    else {
        res.status(200).json({ message: "User alredy exist go back and login !",flag:false})
    }

})


userRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const user = await denizenDb.collections.user.findOne({ email: req.body.email });
        var flag;
        console.log(user);
        if(user === null){
            flag = false
        }
        else{
            flag = true
        }
        if (flag) {
            const cmp = await bcrypt.compare(req.body.password, user.password);
            if (cmp) {
                //   ..... further code to maintain authentication like jwt or sessions
                req.session.userData = {
                    email: user.email,
                    loggedIn: true,
                    userId: user._id
                };

                res.json({message:"Authentication Successful"});
            } else {
                res.json({message:"Incorrect password !"});
            }
        } else {
            res.json({message:"Incorrect email address !"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
});

userRouter.post("/logout", async (req: Request, res: Response) => {
    try {
        req.session.userData = {
            email: null,
            userId: null,
            loggedIn: false,
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
})