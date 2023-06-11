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
export const checkItemExistence = async (item_name: string): null | Promise<WithId<PostItems>> => {
    if (item_name == undefined) {
        return null;
    }
    let item: WithId<PostItems> = await denizenDb.collections.postItems.findOne({
        item_name:item_name,
    });

    if (item) {
        return item;
    }

    return undefined;
};

//update item(single)
export const updateItemDetails = async (newData: {
    id: string,
    item_cost: number,
    delivery_date: string,
    delivery_by: string,
},userData: DenizenUserSession): null | Promise<ObjectId> => {
    const updatedDocument = await denizenDb.collections.postItems.updateOne({ _id: new ObjectId(newData.id), seller_email: userData.email }, 
        { $set: { 
            item_cost: newData.item_cost,
            delivery_date: newData.delivery_date,
            delivery_by: newData.delivery_by,
        } })
    console.log(updatedDocument)
    if (updatedDocument.acknowledged == false) {
        return null
    }

    return updatedDocument.upsertedId;
}

//update user email(assign user to item)
export const updateUserEmail = async (newData: {
    item_id: string,
    seller_email: string,
}, userData: DenizenUserSession): null | Promise<ObjectId> => {
    const updatedDocument = await denizenDb.collections.postItems.updateOne({ _id: new ObjectId(newData.item_id), seller_email: newData.seller_email },
        {
            $set: {
                user_email: userData.email,
                accepted: true,
            }
        })
    console.log(updatedDocument)
    if (updatedDocument.acknowledged == false) {
        return null
    }

    return updatedDocument.upsertedId;
}

//update updateDeliveryStatus
export const updateDeliveryStatus = async (newData: {
    item_id: string,
    seller_email: string,
}): null | Promise<ObjectId> => {
    const updatedDocument = await denizenDb.collections.postItems.updateOne({ _id: new ObjectId(newData.item_id), seller_email: newData.seller_email },
        {
            $set: {
                delivered: true,
            }
        })
    console.log(updatedDocument)
    if (updatedDocument.acknowledged == false) {
        return null
    }

    return updatedDocument.upsertedId;
}