import {Request, Response, Router} from "express";
import User from "../models/user";
import { createUser } from "../services/user.services";
import { denizenDb } from "../services/database.services";

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
        password: req.body.password,
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
    var flag = denizenDb.collections.user.find({ 'email' : { '$exists' : true }})

    if(flag === null){
        const userCreation = await createUser(user);

    !userCreation ?
        res.status(500).json({message: "Error while creating user"}) :
        res.status(200).json({message: "User created"})
    }
    else{
            res.status(200).json({message: "User exist !!"})
    }
    
})
