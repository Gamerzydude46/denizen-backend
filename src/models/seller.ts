import { denizenDb } from "../services/database.services";
import {ObjectId} from "mongodb";

export default class Seller {
    static findOne(arg0: { email: any; }) {
        throw new Error("Method not implemented.");
    }
    static find(arg0: { email: { $exists: boolean; }; }) {
        throw new Error("Method not implemented.");
    }
    constructor(
        public ref_id: string,
        public ref_email:string,
        public business_name: string | null,
        public business_address: Business_Address,
        public _id?: ObjectId,
    ) {}
}

export const sellerSchemaValidation = async () => {
    const validationCommand = {
        collMod: process.env.SELLER_COLLECTION_NAME,
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["ref_id", "ref_email"],
                additionalProperties: false,
                properties: {
                    _id: {
                        bsonType: "objectId",
                        description: "_id for the object, optional",
                    },
                    ref_id: {
                        bsonType: "string",
                        description: "_id from User collection of type string and is required",
                    },
                    ref_email: {
                        bsonType: "string",
                        description: "email from User collection of type string and is required",
                    },
                    business_name: {
                        bsonType: ["string","null"],
                        description: " business_name is of type string, and is required",
                    },
                    business_address: {
                        bsonType: "object",
                        additionalProperties: false,
                        properties: {
                            residence: {
                                bsonType: ["string", "null"],
                                description: "residence is of type string, and is required",
                            },
                            district: {
                                bsonType: ["string", "null"],
                                description: "district is of type string, and is required",
                            },
                            city: {
                                bsonType: ["string", "null"],
                                description: "city is of type string, and is required",
                            },
                            email: {
                                bsonType: ["string", "null"],
                                description: "email is of type string, and is required",
                            },
                            contact: {
                                bsonType: ["number", "null"],
                                description: "contact is of type string, and is required",
                            },
                        }
                    }
                },
            },
        },
    };

    await denizenDb.db.command(validationCommand);
};
