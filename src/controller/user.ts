import { Request, Response, Router } from "express";
import nodemailer from 'nodemailer';
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
            res.status(200).json({ message: "User account created Succesfully !", flag: true })
    }
    else {
        res.status(200).json({ message: "User alredy exist go back and login !", flag: false })
    }

})


userRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const user = await denizenDb.collections.user.findOne({ email: req.body.email });
        var flag;
        if (user === null) {
            flag = false
        }
        else {
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

                res.json({ message: "Authentication Successful" });
            } else {
                res.json({ message: "Incorrect password !", flag });
            }
        } else {
            res.json({ message: "Invalid email address !", flag },);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
});


userRouter.post("/email", async (req: Request, res: Response) => {
    try {
        const user = await denizenDb.collections.user.findOne({ email: req.body.email });
        var flag;
        if (user === null) {
            flag = false
        }
        else {
            flag = true
        }
        if (flag) {
            res.json({ message: "Email address Authentic!", flag },);
        } else {
            res.json({ message: "Invalid email address !", flag },);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
});



userRouter.post("/otp", async (req: Request, res: Response) => {
    try {
        const email = req.body.email;

        var otp: number = Math.random();
        otp = otp * 10000;
        otp= Math.round(otp);

            // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: 'Gmail',

            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            }
        });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Team Denizen"<process.env.MAIL_USERNAME>', // sender address
                to: email, // list of receivers
                subject: "OTP VERIFICATION", // Subject line
                text: "TEAM DENIZEN", // plain text body
                html: "<h3 style=' text-align: center;font-weight:bold;'>OTP for Password Reset</h3>" + "<h1 style='font-weight:bold;text-align: center;'>" + otp + "</h1> <h1 style=' text-align: center'>Thanks, Team Denizen</h1>", // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com
            // Preview only available when sending through an Ethereal account
            //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

        res.status(200).json({ message: 'OTP sended successfully !',key:otp,id: info.messageId })

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
});

userRouter.post("/password-reset", async (req: Request, res: Response) => {
    try {
        const password = await bcrypt.hash(req.body.password, 8);
        const user = await denizenDb.collections.user.findOne({ email: req.body.email });
        var flag;

        if (user === null) {
            flag = false
        }
        else {
            flag = true
        }

        if (flag) {
            denizenDb.collections.user.updateOne({"_id": user._id}, { $set:{"password": password}});
            res.json({ message: "Password reset successfull !",flag});
        } else {
            res.json({ message: "Invalid email address !", flag });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
    }
})

userRouter.post("/logout", async (req: Request, res: Response) => {
    var flag = false;
    try {
        req.session.userData = {
            email: null,
            userId: null,
            loggedIn: false,
        }

        req.session.destroy
        flag = true ;
        res.json({message:"User Logged out !",flag});
    } catch (error) {
        console.log(error);
        res.json({message:"Internal Server error Occured !",flag});
        res.status(500).send("Internal Server error Occured !");
    }
})

userRouter.get("/auth", async (req: Request, res: Response) => {
    
        var authData =  req.session.userData;
        res.json({message:"User Session:",authData});
})