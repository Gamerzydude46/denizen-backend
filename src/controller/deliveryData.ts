import { Request, Response, Router } from "express";
import DeliveryData from "../models/deliveryData";
import { insertData, checkDataExistence } from "../services/delivery.services";
import { denizenDb } from "../services/database.services";
export const deliveryRouter = Router();

//create seller doc in seller collection
//http://localhost:8080/delData/create
deliveryRouter.post("/create", async (req: Request, res: Response) => {
    const deliveryData: DeliveryData = {
        //chnge to session input
        ref_email: req.body.ref_email,
        no_deliveries: req.body.no_deliveries,
        ratings: req.body.ratings
    }
    
    var flag = await checkDataExistence(deliveryData.ref_email);
    if (flag === undefined) {
        const dataCreation = await insertData(deliveryData);
    !dataCreation ?
        res.status(500).json({ message: "Error while inserting delivery details" }) :
        res.status(200).json({ message: "Delivery data details inserted  Succesfully !"})

    }
    else {
        res.status(200).json({ message: "Delivery data already exist !", flag: false })
    }

})