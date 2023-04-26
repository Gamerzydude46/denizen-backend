import * as mongoDB from "mongodb";
import User from "../models/user";
import Seller from "../models/seller";
import PostItems from "../models/postItems";
import Documents from "../models/documents";
import DeliveryData from "../models/deliveryData";


type DenizenCollections = {
    user?: mongoDB.Collection<User>;
    seller?: mongoDB.Collection<Seller>;
    postItems?: mongoDB.Collection<PostItems>;
    documents?: mongoDB.Collection<Documents>;
    deliveryData?: mongoDB.Collection<DeliveryData>;
};

type DenizenDatabase = {
    db?: mongoDB.Db;
    collections?: DenizenCollections;
    client?: mongoDB.MongoClient;
};

type DenizenUserSession = {
    userId: mongoDB.ObjectId;
    email: string,
    loggedIn: boolean;
};

declare module "express-session" {
    interface SessionData {
        userData: DenizenUserSession;
    }
}
