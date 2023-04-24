import Seller from "../models/seller";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { denizenDb } from "./database.services";
import { DenizenUserSession } from "custom";


export const insertSeller = async (seller: Seller): Promise<ObjectId> => {

    const insertedSeller: InsertOneResult<Seller> = await denizenDb.collections.seller.insertOne(seller);
    if (insertedSeller.acknowledged == false) {
        return null;
    }
    return insertedSeller.insertedId;
}


export const checkSellerExistence = async (ref_email: string): null | Promise<WithId<Seller>> => {
    if (ref_email == undefined) {
        return null;
    }
    let seller: WithId<Seller> = await denizenDb.collections.seller.findOne({
        ref_email: ref_email,
    });

    if (seller) {
        return seller;
    }

    return undefined;
};

export const updateSellerDetails = async (newData: {
    business_name: string, business_address: {
        city: string,
        contact: number,
        email: string,
        residence: string,
        district: string
    }
}, userData: DenizenUserSession): null | Promise<ObjectId> => {
    const updatedDocument = await denizenDb.collections.seller.updateOne({ ref_email: userData.email }, { $set: { business_name: newData.business_name, business_address: newData.business_address  } })
    console.log(updatedDocument)
    if (updatedDocument.acknowledged == false) {
        return null
    }

    return updatedDocument.upsertedId;
}