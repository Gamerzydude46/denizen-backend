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
            res.status(200).json({ message: "Delivery data details inserted  Succesfully !" })

    }
    else {
        res.status(200).json({ message: "Delivery data already exist !", flag: false })
    }

})

//get all delivery users for special delivery req
//http://localhost:8080/delData/getDeliveryUser
deliveryRouter.get("/getDeliveryUser", async (req: Request, res: Response) => {
    const allItems = await denizenDb.collections.deliveryData.aggregate([
        {
            $lookup: {
                from: "User",
                localField: "ref_email",
                foreignField: "email",
                as: "deliveryUsers",
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        {
                            $arrayElemAt: ["$deliveryUsers", 0],
                        },
                        "$$ROOT",
                    ],
                },
            },
        },
        {
            $project: {
                ref_email: 1,
                fname: 1,
                lname: 1,
                address: 1,
                no_deliveries: 1,
                ratings: 1,
            },
        },
    ])
        .toArray();

    console.log(allItems);
    !allItems ?
        res.status(500).json({ message: "Error while getting all posted items" }) :
        res.status(200).json({ message: "All posted items retrived successfully!", itemSet: allItems })
})

deliveryRouter.get("/cfAlgo", async (req: Request, res: Response) => {
    const dataSet = await denizenDb.collections.deliveryData.find().toArray();
    const users: Array<any> = [];
    const items: Array<any> = [];
    const ratings: Array<any> = [];

    dataSet.forEach(doc => {
        const user = doc.ref_email;
        const item = doc.no_deliveries;
        const rating = doc.ratings;

        if (!users.includes(user)) {
            users.push(user);
        }

        if (!items.includes(item)) {
            items.push(item);
        }

        ratings.push([users.indexOf(user), items.indexOf(item), rating]);
    });

    const similarityMatrix = [];

    for (let i = 0; i < users.length; i++) {
        const row = [];
        for (let j = 0; j < users.length; j++) {
            const similarities = [];
            for (let k = 0; k < items.length; k++) {
                if (ratings[i][k] && ratings[j][k]) {
                    similarities.push(ratings[i][k] - ratings[j][k]);
                }
            }
            if (similarities.length > 0) {
                const similarity = similarities.reduce((acc, cur) => acc + cur) / similarities.length;
                row.push(similarity);
            } else {
                row.push(0);
            }
        }
        similarityMatrix.push(row);
    }

    console.log(similarityMatrix);
!dataSet ?
    res.status(500).json({ message: "Error while getting data" }) :
    res.status(200).json({ message: "found data", Object: similarityMatrix })

})