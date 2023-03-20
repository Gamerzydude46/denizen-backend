import Seller from "../models/seller";
import { InsertOneResult, ObjectId } from "mongodb";
import { denizenDb } from "./database.services";


export const insertSeller = async (seller: Seller):  Promise<ObjectId> => {

    const insertedSeller: InsertOneResult<Seller> = await denizenDb.collections.seller.insertOne(seller);
    if (insertedSeller.acknowledged == false) {
        return null;
    }
    return insertedSeller.insertedId;
}
