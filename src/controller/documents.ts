import { Request, Response, Router } from "express";
import Documents from "../models/documents";
import { checkDocumentsExistence, uploadDocuments } from "../services/documents.services";
import { denizenDb } from "../services/database.services";
export const documentsRouter = Router();

//upload docs in document collection
//http://localhost:8080/documents/upload
documentsRouter.post("/upload", async (req: Request, res: Response) => {
    const documents: Documents = {
        ref_email: req.session.userData.email,
        profile_picture: req.body.profile_picture,
        resident: req.body.resident,
        liscence: req.body.liscence,
        registration: req.body.registration,
    }
    console.log(req.body)
    var flag = await checkDocumentsExistence(documents.ref_email);
    if (flag === undefined) {
        const docUploaded = await uploadDocuments(documents);
    !docUploaded ?
        res.status(500).json({ message: "Error while uploading documents details" }) :
        res.status(200).json({ message: "Documents details uploaded Succesfully !"})

    }
    else {
        res.status(200).json({ message: "Documents details already exist !", flag: false })
    }

})

//get Docments details of user
//http://localhost:8080/documents/getDoc
documentsRouter.get("/getDoc", async (req: Request, res: Response) => {
    const documents = await denizenDb.collections.documents.findOne({ ref_email: req.session.userData.email });

    !documents ?
        res.status(500).json({ message: "Error while getting documents of user !" }) :
        res.status(200).json({ message: "Found user documents", docs: documents })
})


//get user profile picture details of user
//http://localhost:8080/documents/getProfile
documentsRouter.get("/getProfile", async (req: Request, res: Response) => {
    const documents = await denizenDb.collections.documents.findOne({ ref_email: req.session.userData.email });

    !documents ?
        res.status(500).json({ message: "Error while getting documents of user !" }) :
        res.status(200).json({ message: "Found user documents", docs: documents.profile_picture })
})


//http://localhost:8080/documents/getUserProfile
documentsRouter.post("/getUserProfile", async (req: Request, res: Response) => {
    const documents = await denizenDb.collections.documents.findOne({ ref_email: req.body.user_email });
    !documents ?
        res.status(500).json({ message: "Error while getting documents of user !" , flag: false}) :
        res.status(200).json({ message: "Found user documents", docs: documents.profile_picture ,flag: true})
})
