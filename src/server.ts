import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { connectToDatabase } from "./services/database.services";
import { userRouter } from "./controller/user";
import bodyParser from "body-parser";

const app = express();
const port = 8080; // default port to listen
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
        credentials: true,
    }),
);
dotenv.config();

connectToDatabase().then(() => {
    app.use("/user", userRouter);
    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
});
