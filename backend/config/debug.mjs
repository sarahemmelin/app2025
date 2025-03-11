import dotenv from "dotenv";

if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    dotenv.config();
    process.env.NODE_ENV = process.env.NODE_ENV || "development";
}

const DEBUG_MODE = process.env.NODE_ENV !== "production";

export { DEBUG_MODE };