import PostItems from "../models/postItems";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { denizenDb } from "./database.services";
import { DenizenUserSession } from "custom";

//insert item in postItems Collection
export const createItem = async (postItems: PostItems): null | Promise<ObjectId> => {

    const createdItem: InsertOneResult<PostItems> = await denizenDb.collections.postItems.insertOne(postItems);
    if (createdItem.acknowledged == false) {
        return null;
    }
    return createdItem.insertedId;
}


//checksum
export const checkItemExistence = async (seller_email: string): null | Promise<WithId<PostItems>> => {
    if (seller_email == undefined) {
        return null;
    }
    let item: WithId<PostItems> = await denizenDb.collections.postItems.findOne({
        seller_email: seller_email,
    });

    if (item) {
        return item;
    }

    return undefined;
};

//update item(single)
export const updateItemDetails = async (newData: {
    item_name: string,
    delivery_address: string,
    item_cost: number,
    delivery_cost: number,
    distance: number,
    delivery_date: string,
    delivery_by: string,
    category: "small" | "medium" | "large" ,
},userData: DenizenUserSession): null | Promise<ObjectId> => {
    const updatedDocument = await denizenDb.collections.postItems.updateOne({ seller_email: userData.email }, 
        { $set: { 
            item_name: newData.item_name, 
            delivery_address: newData.delivery_address,
            item_cost: newData.item_cost,
            delivery_cost: newData.delivery_cost,
            distance: newData.distance,
            delivery_date: newData.delivery_date,
            delivery_by: newData.delivery_by,
            category: newData.category
        } })
    console.log(updatedDocument)
    if (updatedDocument.acknowledged == false) {
        return null
    }

    return updatedDocument.upsertedId;
}

//update user email(assign user to item)
export const updateUserEmail = async (newData: {seller_email: string,},userData: DenizenUserSession): null | Promise<ObjectId> => {
    const updatedDocument = await denizenDb.collections.postItems.updateOne({ seller_email: newData.seller_email }, 
        { $set: { 
            user_email: userData.email,
            accepted: true, 
        } })
    console.log(updatedDocument)
    if (updatedDocument.acknowledged == false) {
        return null
    }

    return updatedDocument.upsertedId;
}