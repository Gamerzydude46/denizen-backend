import { denizenDb } from "../services/database.services";
import {ObjectId} from "mongodb";

export default class Documents {
    constructor(
        public ref_email:string,
        public profile_picture: Profile_picture,
        public resident: Resident,
        public liscence: License,
        public registration: Registration,
        public _id?: ObjectId,
    ) {}
}

export const documentsSchemaValidation = async () => {
    const validationCommand = {
        collMod: process.env.DOC_COLLECTION_NAME,
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["ref_email" ,"profile_picture", "resident", "liscence", "registration"],
                additionalProperties: false,
                properties: {
                    _id: {
                        bsonType: "objectId",
                        description: "_id for the object, optional",
                    },
                    ref_email: {
                        bsonType: "string",
                        description: "email from User collection of type string and is required",
                    },
                    profile_picture: {
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
                    resident: {
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
                    liscence: {
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
                    registration: {
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
                },
            },
        },
    };

    await denizenDb.db.command(validationCommand);
};
