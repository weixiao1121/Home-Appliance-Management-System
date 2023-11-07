import express from "express";
import flash from "express-flash-message";
import bodyParser from "body-parser";
import Router from "./routes.js";
import path, { dirname } from "node:path";
import session from "express-session";
import { fileURLToPath } from "node:url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// flash components
app.use(
  session({
    secret: "a-test-secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(
  flash({
    sessionKeyName: "express-flash-message",
  }),
);
app.use(Router);

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
