import { Request, Response, Router } from "express";
import Seller from "../models/seller";
import { insertSeller } from "../services/seller.services";
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

    const sellerCreation = await insertSeller(seller);
    !sellerCreation ?
        res.status(500).json({ message: "Error while inserting seller details" }) :
        res.status(200).json({ message: "Seller deatils inserted  Succesfully !"})


})