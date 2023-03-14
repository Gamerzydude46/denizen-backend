import { userSchemaValidation } from "../models/user";
import { denizenDb } from "./database.services";

export const initDb = async () => {
    await denizenDb.db
        .createCollection(process.env.USER_COLLECTION_NAME)
        .then(async () => {
            await userSchemaValidation();
            console.log("Created collection " + process.env.USER_COLLECTION_NAME);
        })
        .catch((err) => {
            console.log(
                "Collection < " + process.env.USER_COLLECTION_NAME + " > already exist, skipping schema validation. ",
            );
        }); // Change
};
