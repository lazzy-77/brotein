import config from "config";
import { app } from "./app.js";

// const PORT = process.env.SERVER_PORT || config.get("App.PORT");
const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
});