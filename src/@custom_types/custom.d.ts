import * as mongoDB from "mongodb";
import User from "../models/user";
import Seller from "../models/seller";
import PostItems from "../models/postItems";


type DenizenCollections = {
    user?: mongoDB.Collection<User>;
    seller?: mongoDB.Collection<Seller>;
    postItems?: mongoDB.Collection<PostItems>;
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
