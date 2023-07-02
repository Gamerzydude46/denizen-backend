import { denizenDb } from "../services/database.services";
import {ObjectId} from "mongodb";

export default class DeliveryData {
    
    constructor(
        public ref_email:string,
        public no_deliveries: number,
        public ratings: 1 | 2 | 3 | 4 | 5,
        public _id?: ObjectId,
    ) {}
}

export const deliveryDataSchemaValidation = async () => {
    const validationCommand = {
        collMod: process.env.DELIVERY_COLLECTION_NAME,
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["ref_email", "no_deliveries", "ratings"],
                additionalProperties: false,
                properties: {
                    _id: {
                        bsonType: "objectId",
                        description: "_id for the object, optional",
                    },
                    ref_email: {
                        bsonType: "string",
                        description: "email from deliveryData collection of type string and is required",
                    },
                    no_deliveries: {
                        bsonType: "number",
                        description: "ratings is of type string, and is required",
                    },
                    ratings: {
                        bsonType: "number",
                        description: "ratings is of type string, and is required",
                    },
                },
            },
        },
    };

    await denizenDb.db.command(validationCommand);
};
