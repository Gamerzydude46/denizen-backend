import { Request, Response, Router } from "express";
import PostItems from "../models/postItems";
import { createItem, checkItemExistence, updateItemDetails, updateUserEmail, updateDeliveryStatus } from "../services/post.services";
import { denizenDb } from "../services/database.services";
export const postItemsRouter = Router();
import nodemailer from 'nodemailer';


//create new item collection route
//http://localhost:8080/postItems/post
postItemsRouter.post("/post", async (req: Request, res: Response) => {
    //console.log(makeStorageClientFile())
    const postItems: PostItems = {
        seller_email: req.session.userData.email,
        user_email: null,
        receiver: {
            name: req.body.reciever.name,
            contact: req.body.reciever.contact
        },
        item_name: req.body.item_name,
        delivery_address: req.body.delivery_address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        item_cost: req.body.item_cost,
        delivery_cost: req.body.delivery_cost,
        distance: req.body.distance,
        delivery_date: req.body.delivery_date,
        delivery_by: req.body.delivery_by,
        category: req.body.category,
        imageURL: req.body.imageURL,
        accepted: false,
        delivered: false,
        special: false,
    }

    // Check already exist
    var flag = await checkItemExistence(postItems.item_name);
    if (flag === undefined) {
        const itemCreation = await createItem(postItems);
        !itemCreation ?
            res.status(500).json({ message: "Error while uploading new item" }) :
            res.status(200).json({ message: "New Item uploaded  Succesfully !", flag: true })
    }
    else {
        res.status(200).json({ message: "This Item alredy uploaded !", flag: false })
    }

})


//create new item collection route (for special request)
//http://localhost:8080/postItems/postSpecial
postItemsRouter.post("/postSpecial", async (req: Request, res: Response) => {
    //console.log(makeStorageClientFile())
    const postItems: PostItems = {
        seller_email: req.session.userData.email,
        user_email: req.body.user_email,
        receiver: {
            name: req.body.reciever.name,
            contact: req.body.reciever.contact
        },
        item_name: req.body.item_name,
        delivery_address: req.body.delivery_address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        item_cost: req.body.item_cost,
        delivery_cost: req.body.delivery_cost,
        distance: req.body.distance,
        delivery_date: req.body.delivery_date,
        delivery_by: req.body.delivery_by,
        category: req.body.category,
        imageURL: req.body.imageURL,
        accepted: false,
        delivered: false,
        special: true,
    }

    var email = req.body.user_email;
    // Check already exist
    var flag = await checkItemExistence(postItems.item_name);
    if (flag === undefined) {
        const itemCreation = await createItem(postItems);
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: 'Gmail',

            auth: {
                user: "19co58@aitdgoa.edu.in",
                pass: "Sujay9823",
            }
        });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Team Denizen"<process.env.MAIL_USERNAME>', // sender address
                to: email, // list of receivers
                subject: "Special Request for Delivery", // Subject line
                text: "TEAM DENIZEN", // plain text body
                html: "<h3 style=' text-align: center;font-weight:bold;'>You have a special delivery request from seller</h3>"+postItems.seller_email+"<h2>Kindly chek your Feed for deatils, Order reference Id:<h2/><h1 style='font-weight:bold;text-align: center;'>" + postItems._id + "</h1> <h1 style=' text-align: center'>Thanks, Team Denizen</h1>", // html body
            });

            console.log("Message sent: %s", info.messageId);
        !itemCreation ?
            res.status(500).json({ message: "Error while uploading new item for special request" }) :
            res.status(200).json({ message: "New Item uploaded  Succesfully for special request !", flag: true })
    }
    else {
        res.status(200).json({ message: "This Item alredy uploaded for special request!", flag: false })
    }
})

//get all items available in collection  route for  seller feed
postItemsRouter.get("/getOrders", async (req: Request, res: Response) => {
    try {
        const orders = await denizenDb.collections.postItems.find({ delivered: false, seller_email: req.session.userData.email }).toArray();
        res.status(200).json({ message: orders });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to get orders",
            error: err.message,
            success: false
        })
    }
})

//get all items available in collection  route for  track feed
//http://localhost:8080/postItems/trackOrders
postItemsRouter.get("/trackOrders", async (req: Request, res: Response) => {
    try {
        console.log(req.session.userData)
        const orders = await denizenDb.collections.postItems.find({ accepted:true, seller_email: req.session.userData.email }).toArray();
        res.status(200).json({ message: orders });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Failed to get orders",
            error: err.message,
            success: false
        })
    }
})

//get all items available in collection  route for  Myorder feed
//http://localhost:8080/postItems/getMyorders
postItemsRouter.get("/getMyorders", async (req: Request, res: Response) => {
    const allItems = await denizenDb.collections.postItems.find({user_email:req.session.userData.email, accepted: true , }).toArray();
    !allItems ?
        res.status(500).json({ message: "Error while getting all orders items" }) :
        res.status(200).json({ message: "All My orders retrived successfully!", itemSet: allItems })
})

//get all items available in collection  route for  Common feed
//http://localhost:8080/postItems/getItems
postItemsRouter.get("/getItems", async (req: Request, res: Response) => {
    const allItems = await denizenDb.collections.postItems.find({ accepted: false, special:false }).toArray();
    !allItems ?
        res.status(500).json({ message: "Error while getting all posted items" }) :
        res.status(200).json({ message: "All posted items retrived successfully!", itemSet: allItems })
})

//get all items available in collection  route for  special feed
//http://localhost:8080/postItems/getSpecial
postItemsRouter.get("/getSpecial", async (req: Request, res: Response) => {
    const allItems = await denizenDb.collections.postItems.find({ user_email:req.session.userData.email , special: true , accepted:false  }).toArray();
    !allItems ?
        res.status(500).json({ message: "Error while getting all speical items" }) :
        res.status(200).json({ message: "All special items retrived successfully!", itemSet: allItems })
})

//get businessName
//http://localhost:8080/postItems/getBname
postItemsRouter.put("/getBname", async (req: Request, res: Response) => {
    const businessName = await denizenDb.collections.seller.findOne({ ref_email: req.body.ref_email });

    !businessName ?
        res.status(500).json({ message: "Error while getting Business name" }) :
        res.status(200).json({
            message: "Business name retrived successfully!",
            address: businessName.business_address.residence,
            contact: businessName.business_address.contact,
            name: businessName.business_name,
            latitude: businessName.business_address.latitude,
            longitude:  businessName.business_address.longitude
        })
})

//update posted item(single) route
//http://localhost:8080/postItems/update
postItemsRouter.put("/update", async (req: Request, res: Response) => {
    try {
        const updatedItem = await updateItemDetails(req.body, req.session.userData);

        updatedItem ?
            res.status(500).json({ message: "Error while updating Item data" }) :
            res.status(200).json({ message: "Item data updated successfully" })
    } catch (error) {
        console.log(error)
    }
})

//update user email route (when delivery user accpet sorder)
//Delivery user side usage
//http://localhost:8080/postItems/accepted
postItemsRouter.put("/accepted", async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const updatedUser = await updateUserEmail(req.body, req.session.userData);
        
        updatedUser ?
            res.status(500).json({ message: "Error while assigning user to Item" }) :
            res.status(200).json({ message: "You have accepted the order successfully !" })
    } catch (error) {
        console.log(error)
    }
})

//NOTE: route to make when item delivered need to do......
postItemsRouter.put("/delivered", async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const updatedUser = await updateDeliveryStatus(req.body);
        
        updatedUser ?
            res.status(500).json({ message: "Error while assigning user to Item" }) :
            res.status(200).json({ message: "You order has been delivered successfully !" })
    } catch (error) {
        console.log(error)
    }
})
