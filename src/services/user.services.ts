import User from "../models/user";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { denizenDb } from "./database.services";
import { DenizenUserSession } from "custom";


export const createUser = async (user: User): null | Promise<ObjectId> => {

    const createdUser: InsertOneResult<User> = await denizenDb.collections.user.insertOne(user);
    if (createdUser.acknowledged == false) {
        return null;
    }
    return createdUser.insertedId;
};

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


//user deatils section update
export const updateUserDetails = async (newData: {
    // fname: string,
    // lname: string,
    mname: string,
    dob: string,
    gender: "male" | "female" | "others",
    pan: string,
    adhar: number,
}, userData: DenizenUserSession): null | Promise<ObjectId> => {
    const updatedDocument = await denizenDb.collections.user.updateOne({ email:userData.email }, {
        $set: {
            // fname: newData.fname,
            // lname: newData.lname,
            mname: newData.mname,
            dob: newData.dob,
            gender: newData.gender,
            pan: newData.pan,
            adhar: newData.adhar,
        }
    })
    console.log(updatedDocument)
    if (updatedDocument.acknowledged == false) {
        return null
    }

    return updatedDocument.upsertedId;
}


//user Address section update
export const updateUserAddressDetails = async (newData: {
    address: {
        city: string,
        contact: number,
        pincode: number,
        residence: string,
        state: string
    }
}, userData: DenizenUserSession): null | Promise<ObjectId> => {
    const updatedDocument = await denizenDb.collections.user.updateOne({ email: userData.email }, {
        $set: {
            address: newData.address
        }
    })
    console.log(updatedDocument)
    if (updatedDocument.acknowledged == false) {
        return null
    }

    return updatedDocument.upsertedId;
}

export const verifyUser = async (userData: DenizenUserSession): null | Promise<ObjectId> => {
    const updatedDocument = await denizenDb.collections.user.updateOne({ email: userData.email }, {
        $set: {
            verified: true
        }
    })
    console.log(updatedDocument)
    if (updatedDocument.acknowledged == false) {
        return null
    }

    return updatedDocument.upsertedId;
}