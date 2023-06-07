import { denizenDb } from "../services/database.services";
import {ObjectId} from "mongodb";

export default class PostItems {

    constructor(
        public seller_email:string,
        public user_email:string | null,
        public receiver: Receiver,
        public item_name: string,
        public delivery_address: string,
        public latitude: number,
        public longitude: number,
        public item_cost: number,
        public delivery_cost: number,
        public distance: number,
        public delivery_date: string,
        public delivery_by: string,
        public category: "small" | "medium" | "large" ,
        public imageURL: Image,
        public accepted: boolean,
        public delivered: boolean,
        public special: boolean,
        public _id?: ObjectId,
    ) {}
}

export const postItemsSchemaValidation = async () => {
    const validationCommand = {
        collMod: process.env.POST_COLLECTION_NAME,
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [
                    "seller_email", 
                    "item_name" ,
                    "reciever",
                    "delivery_address",
                    "latitude",
                    "longitude",
                    "item_cost",
                    "delivery_cost",
                    "distance",
                    "distance",
                    "delivery_date",
                    "delivery_by",
                    "category",
                    "imageURL",
                    "accepted",
                    "delivered",
                ],
                additionalProperties: false,
                properties: {
                    _id: {
                        bsonType: "objectId",
                        description: "_id for the object, optional",
                    },
                    seller_email: {
                        bsonType: "string",
                        description: "seller_email from postItems collection of type string and is required",
                    },
                    user_email: {
                        bsonType: ["string","null"],
                        description: "user_email from postItems collection of type string and is required",
                    },
                    receiver: {
                        bsonType: "object",
                        additionalProperties: false,
                        properties: {
                            name: {
                                bsonType: "string",
                                description: "URL is of type string, and is required",
                            },
                            contact: {
                                bsonType: "number",
                                description: "name is of type string, and is required",
                            },
                        }
                    },
                    item_name: {
                        bsonType: "string",
                        description: "item_name from postItems collection of type string and is required",
                    },
                    delivery_address: {
                        bsonType: "string",
                        description: "delivery_address from postItems collection of type string and is required",
                    },
                    latitude: {
                        bsonType: "number",
                        description: "latitude from postItems collection of type string and is required",
                    },
                    longitude: {
                        bsonType: "number",
                        description: "longitude from postItems collection of type string and is required",
                    },
                    item_cost: {
                        bsonType: "number",
                        description: "item_cost from postItems collection of type number and is required",
                    },
                    delivery_cost: {
                        bsonType: "number",
                        description: "delivery_cost from postItems collection of type number and is required",
                    },
                    distance: {
                        bsonType: "number",
                        description: "distance from postItems collection of type number and is required",
                    },
                    delivery_date: {
                        bsonType: "string",
                        description: "delivery_date from postItems collection of type string and is required",
                    },
                    delivery_by: {
                        bsonType: "string",
                        description: "delivery_by from postItems collection of type string and is required",
                    },
                    category: {
                        enum: ["small" , "medium" , "large"],
                        description: "type can be 'small' | 'medium' | 'large' and is required",
                    },
                    imageURL: {
                        bsonType: "object",
                        additionalProperties: false,
                        properties: {
                            URL: {
                                bsonType: "string",
                                description: "URL is of type string, and is required",
                            },
                            name: {
                                bsonType: "string",
                                description: "name is of type string, and is required",
                            },
                        }
                    },
                    accepted: {
                        bsonType: "bool",
                        description: "accepted is a boolean, and is requrired",
                    },
                    delivered: {
                        bsonType: "bool",
                        description: "delivered is a boolean, and is requrired",
                    },
                    special: {
                        bsonType: "bool",
                        description: "special is a boolean, and is requrired",
                    },
                },
            },
        },
    };

    await denizenDb.db.command(validationCommand);
};
