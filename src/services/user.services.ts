import User from "../models/user";
import {InsertOneResult, ObjectId} from "mongodb";
import { denizenDb } from "./database.services";

export const createUser = async (user: User): null | Promise<ObjectId> => {
    const createdUser: InsertOneResult<User> = await denizenDb.collections.user.insertOne(user);

    if (createdUser.acknowledged == false) {
        return null;
    }

    return createdUser.insertedId;
}
