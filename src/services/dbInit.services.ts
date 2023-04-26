import { userSchemaValidation } from "../models/user";
import { sellerSchemaValidation } from "../models/seller";
import { postItemsSchemaValidation } from "../models/postItems";
import { documentsSchemaValidation } from "../models/documents";
import { deliveryDataSchemaValidation } from "../models/deliveryData";
import { denizenDb } from "./database.services";

export const initDb = async () => {
    //User
    await denizenDb.db
        .createCollection(process.env.USER_COLLECTION_NAME)
        .then(async () => {
            await userSchemaValidation();
            console.log("Created collection < " + process.env.USER_COLLECTION_NAME + " >");
        })
        .catch((err) => {
            console.log(
                "Collection < " + process.env.USER_COLLECTION_NAME + " > already exist, skipping schema validation. ",
            );
        });
    
    //Seller
    await denizenDb.db
        .createCollection(process.env.SELLER_COLLECTION_NAME)
        .then(async () => {
            await sellerSchemaValidation();
            console.log("Created collection " + process.env.SELLER_COLLECTION_NAME);
        })
        .catch((err) => {
            console.log(
                "Collection < " + process.env.SELLER_COLLECTION_NAME + " > already exist, skipping schema validation. ",
            );
        });

    //PostItems
    await denizenDb.db
        .createCollection(process.env.POST_COLLECTION_NAME)
        .then(async () => {
            await postItemsSchemaValidation();
            console.log("Created collection " + process.env.POST_COLLECTION_NAME);
        })
        .catch((err) => {
            console.log(
                "Collection < " + process.env.POST_COLLECTION_NAME + " > already exist, skipping schema validation. ",
            );
        });

    //Documents
    await denizenDb.db
    .createCollection(process.env.DOC_COLLECTION_NAME)
    .then(async () => {
        await documentsSchemaValidation();
        console.log("Created collection " + process.env.DOC_COLLECTION_NAME);
    })
    .catch((err) => {
        console.log(
            "Collection < " + process.env.DOC_COLLECTION_NAME + " > already exist, skipping schema validation. ",
        );
    });

    //DeliveryData
    await denizenDb.db
    .createCollection(process.env.DELIVERY_COLLECTION_NAME)
    .then(async () => {
        await deliveryDataSchemaValidation();
        console.log("Created collection " + process.env.DELIVERY_COLLECTION_NAME);
    })
    .catch((err) => {
        console.log(
            "Collection < " + process.env.DELIVERY_COLLECTION_NAME + " > already exist, skipping schema validation. ",
        );
    });
};
