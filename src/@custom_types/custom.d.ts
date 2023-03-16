import * as mongoDB from "mongodb";
import User from "../models/user";

type DenizenCollections = {
    user?: mongoDB.Collection<User>;
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
