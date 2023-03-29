import { Request, Response, Router } from "express";
import Seller from "../models/seller";
import { insertSeller, checkUserExistence, updateSellerDetails } from "../services/seller.services";
import { denizenDb } from "../services/database.services";
export const sellerRouter = Router();


sellerRouter.post("/create", async (req: Request, res: Response) => {
    const seller: Seller = {
        ref_id: req.body.ref_id,
        ref_email: req.body.ref_email,
        business_name: null,
        business_address: {
            city: null,
            contact: null,
            email: null,
            residence: null,
            district: null
        },
    }
    
    var flag = await checkUserExistence(seller.ref_email);
    if (flag === undefined) {
        const sellerCreation = await insertSeller(seller);
    !sellerCreation ?
        res.status(500).json({ message: "Error while inserting seller details" }) :
        res.status(200).json({ message: "Seller deatils inserted  Succesfully !"})

    }
    else {
        res.status(200).json({ message: "Seller already exist !", flag: false })
    }

})

sellerRouter.put("/update", async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const updatedSeller = await updateSellerDetails(req.body, req.session.userData);
        
        !updatedSeller ?
            res.status(500).json({ message: "Error while updating seller data" }) :
            res.status(200).json({ message: "Seller data updated successfully" })
    } catch (error) {
        console.log(error)
    }
})

sellerRouter.get("/auth", async (req: Request, res: Response) => {
    const seller = await denizenDb.collections.seller.findOne({ ref_email: req.session.userData.email });

    !seller ?
        res.status(500).json({ message: "Error while getting seller" }) :
        res.status(200).json({ message: "found seller", data: seller })
})