import DeliveryData from "../models/deliveryData";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { denizenDb } from "./database.services";
import { DenizenUserSession } from "custom";


export const insertData = async (deliveryData: DeliveryData): Promise<ObjectId> => {

    const insertedData: InsertOneResult<DeliveryData> = await denizenDb.collections.deliveryData.insertOne(deliveryData);
    if (insertedData.acknowledged == false) {
        return null;
    }
    return insertedData.insertedId;
}


export const checkDataExistence = async (ref_email: string): null | Promise<WithId<DeliveryData>> => {
    if (ref_email == undefined) {
        return null;
    }
    let data: WithId<DeliveryData> = await denizenDb.collections.deliveryData.findOne({
        ref_email: ref_email,
    });

    if (data) {
        return data;
    }else{
        return undefined;
    }

};

