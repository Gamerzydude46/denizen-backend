import * as mongoDB from "mongodb";
import User from "../models/user";
import Seller from "../models/seller";
import PostItems from "../models/postItems";
import Documents from "../models/documents";
import DeliveryData from "../models/deliveryData";
import {  DenizenDatabase } from "custom";
import { initDb } from "./dbInit.services";




export var denizenDb: DenizenDatabase = {};

export async function connectToDatabase() {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
    await client.connect();

    const db: mongoDB.Db = client.db(process.env.DB_NAME);
    console.log(`Yoooo! Connected to database ${db.databaseName}\n`);

    const userCollection: mongoDB.Collection<User> = db.collection<User>(process.env.USER_COLLECTION_NAME);
    const sellerCollection: mongoDB.Collection<Seller> = db.collection<Seller>(process.env.SELLER_COLLECTION_NAME);
    const postItemsCollection: mongoDB.Collection<PostItems> =db.collection<PostItems>(process.env.POST_COLLECTION_NAME);
    const documentsCollection: mongoDB.Collection<Documents> =db.collection<Documents>(process.env.DOC_COLLECTION_NAME);
    const deliveryCollection: mongoDB.Collection<DeliveryData> =db.collection<DeliveryData>(process.env.DELIVERY_COLLECTION_NAME)// change

    denizenDb.db = db;
    denizenDb.collections = {};
    denizenDb.collections.user = userCollection; 
    denizenDb.collections.seller = sellerCollection;
    denizenDb.collections.postItems = postItemsCollection;
    denizenDb.collections.documents = documentsCollection;
    denizenDb.collections.deliveryData = deliveryCollection;// change

    await initDb();
}
