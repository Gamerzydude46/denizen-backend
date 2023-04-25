import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { connectToDatabase } from "./services/database.services";
import { userRouter } from "./controller/user";
import { sellerRouter } from "./controller/seller";
import { postItemsRouter } from "./controller/postItems";
import bodyParser from "body-parser";
import session from "express-session";
import MongoDBStore from "connect-mongodb-session";
dotenv.config()
const mongoStore = MongoDBStore(session);

const store = new mongoStore({
    databaseName: "Cluster0",
    collection: "userSessions",
    uri: process.env.DB_CONN_STRING,
    expires: 1000 * 60,
});

//express app setup with cors
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

//session config
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SECRET,
        store: store,
        cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
    }),
);
dotenv.config();

//Api routes(main)
connectToDatabase().then(() => {
    app.use("/user", userRouter);
    app.use("/seller", sellerRouter);
    app.use("/postItems", postItemsRouter);
    app.listen(port, () => {
        console.log(`server started at http://localhost:${port}`);
    });
});
