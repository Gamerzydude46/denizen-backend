import * as mongoDB from "mongodb";
import User from "../models/user";
import Seller from "../models/seller";


type DenizenCollections = {
    user?: mongoDB.Collection<User>;
    seller?: mongoDB.Collection<Seller>;
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
