import { denizenDb } from "../services/database.services";
import {ObjectId} from "mongodb";

export default class User {
    static find(arg0: { email: { $exists: boolean; }; }) {
        throw new Error("Method not implemented.");
    }
    constructor(
        public fname: string,
        public lname: string,
        public mname: string,
        public dob: string,
        public gender: "male" | "female" | "others" ,
        public type: "seller" | "delivery",
        public email: string,
        public password: string,
        public verified: boolean,
        public address: Address,
        public pan: string,
        public adhar: number,
        public _id?: ObjectId,
    ) {}
}

export const userSchemaValidation = async () => {
    const validationCommand = {
        collMod: process.env.USER_COLLECTION_NAME,
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["fname", "lname", "type", "email", "password"],
                additionalProperties: false,
                properties: {
                    _id: {
                        bsonType: "objectId",
                        description: "_id for the object, optional",
                    },
                    fname: {
                        bsonType: "string",
                        description: "fname is of type string, and is required",
                    },
                    mname: {
                        bsonType: ["string", "null"],
                        description: "mname is of type string, and is required",
                    },
                    lname: {
                        bsonType: ["string", "null"],
                        description: "lname is of type string, and is required",
                    },
                    type: {
                        enum: ["seller", "delivery"],
                        description: "type can be 'seller' or 'delivery', and is required",
                    },
                    gender: {
                        enum: ["male", "female", "others","null"],
                        description: "type can be 'male', 'female', 'others', and is required",
                    },
                    email: {
                        bsonType: "string",
                        description: "email is of type string, and is required",
                    },
                    dob: {
                        bsonType: ["string", "null"],
                        description: "dob is of type string, and is required",
                    },
                    password: {
                        bsonType: "string",
                        description: "password is of type string, and is required",
                    },
                    pan: {
                        bsonType: ["string", "null"],
                        description: "pan is of type string, and is required",
                    },
                    adhar: {
                        bsonType: ["number", "null"],
                        description: "adhar is of type string, and is required",
                    },
                    verified: {
                        bsonType: "bool",
                        description: "verified is a boolean, and is requrired",
                    },
                    address: {
                        bsonType: "object",
                        additionalProperties: false,
                        properties: {
                            residence: {
                                bsonType: ["string", "null"],
                                description: "residence is of type string, and is required",
                            },
                            state: {
                                bsonType: ["string", "null"],
                                description: "state is of type string, and is required",
                            },
                            city: {
                                bsonType: ["string", "null"],
                                description: "city is of type string, and is required",
                            },
                            pincode: {
                                bsonType: ["number", "null"],
                                description: "pincode is of type string, and is required",
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
