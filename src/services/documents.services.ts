import Documents from "../models/documents";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { denizenDb } from "./database.services";
import { DenizenUserSession } from "custom";

//upload docs in documents Collection
export const uploadDocuments = async (documents: Documents): null | Promise<ObjectId> => {

    const uploadDocuments: InsertOneResult<Documents> = await denizenDb.collections.documents.insertOne(documents);
    if (uploadDocuments.acknowledged == false) {
        return null;
    }
    return uploadDocuments.insertedId;
}


//checksum
export const checkDocumentsExistence = async (ref_email: string): null | Promise<WithId<Documents>> => {
    if (ref_email == undefined) {
        return null;
    }
    let item: WithId<Documents> = await denizenDb.collections.documents.findOne({
        ref_email: ref_email,
    });

    if (item) {
        return item;
    }

    return undefined;
};