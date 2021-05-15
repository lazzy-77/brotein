import config from "config";
import { app } from "./app.js";
import logger from './logger/logger.js';


// const PORT = process.env.SERVER_PORT || config.get("App.PORT");
const PORT = process.env.SERVER_PORT || 8080;

const NAMESPACE = "Server";

app.listen(PORT, () => {
    logger.info(NAMESPACE, "Starting server at  http://localhost:" + PORT)
});