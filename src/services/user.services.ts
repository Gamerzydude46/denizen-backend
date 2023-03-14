import User from "../models/user";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { denizenDb } from "./database.services";


export const createUser = async (user: User): null | Promise<ObjectId> => {

    const createdUser: InsertOneResult<User> = await denizenDb.collections.user.insertOne(user);
    if (createdUser.acknowledged == false) {
        return null;
    }
    return createdUser.insertedId;
}

export const checkUserExistence = async (email: string): null | Promise<WithId<User>> => {
    if (email == undefined) {
        return null;
    }
    let user: WithId<User> = await denizenDb.collections.user.findOne({
        email: email,
    });

    if (user) {
        return user;
    }

    return undefined;
};