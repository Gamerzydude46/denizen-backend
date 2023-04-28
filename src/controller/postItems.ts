import { Request, Response, Router } from "express";
import PostItems from "../models/postItems";
import { createItem,checkItemExistence, updateItemDetails, updateUserEmail} from "../services/post.services";
import { denizenDb } from "../services/database.services";
export const postItemsRouter = Router();


//create new item collection route
//http://localhost:8080/postItems/post
postItemsRouter.post("/post", async (req: Request, res: Response) => {
            //console.log(makeStorageClientFile())
                    const postItems: PostItems = {
                        seller_email: req.session.userData.email,
                        user_email: null,
                        receiver: req.body.receiver,
                        item_name: req.body.item_name,
                        delivery_address: req.body.delivery_address,
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
                    var flag = await checkItemExistence(postItems.seller_email);
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
                receiver: req.body.receiver,
                item_name: req.body.item_name,
                delivery_address: req.body.delivery_address,
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

            // Check already exist
            var flag = await checkItemExistence(postItems.seller_email);
            if (flag === undefined) {
                const itemCreation = await createItem(postItems);
                !itemCreation ?
                    res.status(500).json({ message: "Error while uploading new item for special request" }) :
                    res.status(200).json({ message: "New Item uploaded  Succesfully for special request !", flag: true })
            }
            else {
                res.status(200).json({ message: "This Item alredy uploaded for special request!", flag: false })
            }
    
})

//get all items available in collection  route for  seller feed
//pending..
//get all items available in collection  route for  Myorder feed
//pending...


//get all items available in collection  route for  Common feed
//http://localhost:8080/postItems/getItems
postItemsRouter.get("/getItems", async (req: Request, res: Response) => {
    const allItems = await denizenDb.collections.postItems.find({delivered:false}).toArray();
    console.log(allItems);
    !allItems ?
        res.status(500).json({ message: "Error while getting all posted items" }) :
        res.status(200).json({ message: "All posted items retrived successfully!", itemSet: allItems })
})

//update posted item(single) route
//http://localhost:8080/postItems/update
postItemsRouter.put("/update", async (req: Request, res: Response) => {
    try {
        const updatedItem = await updateItemDetails(req.body, req.session.userData);
        
        updatedItem ?
            res.status(500).json({ message: "Error while updating Item data"}) :
            res.status(200).json({ message: "Item data updated successfully"})
    } catch (error) {
        console.log(error)
    }
})

//update user email route (when delivery user accpet sorder)
//Delivery user side usage
//http://localhost:8080/postItems/accepted
postItemsRouter.put("/accepted", async (req: Request, res: Response) => {
    try {
        const updatedUser = await updateUserEmail(req.body.seller_email,req.session.userData);
        
        updatedUser ?
            res.status(500).json({ message: "Error while assigning user to Item" }) :
            res.status(200).json({ message: "User assigned to Item  successfully !" })
    } catch (error) {
        console.log(error)
    }
})

//NOTE: route to make when item delivered need to do......