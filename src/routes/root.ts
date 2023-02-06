// ! // Importing Modules //
import express, { Router, Request, Response } from "express";
import Logger from "../lib/logger";
// import verify from "../middlewares/auth";
import { getFiles } from "../tools/tool";

// * // Initialize Router //
const router: Router = express.Router();

// * // Root Route //
router.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Nodejs Ts File-Ops 🐼",
    });
});

// * // Get File Names //
router.post("/getFiles", async (req: Request, res: Response) => {
    try {
        // * // Extract Params //
        let { filePath, getList, includeExt } = req.body;

        // * // Decode File Path //
        filePath = decodeURIComponent(filePath.toString());

        // ! // Check for Valid File Path //
        if (filePath && typeof filePath === "string") {
            const fileNames = await getFiles({
                filePath: filePath,
                includeExt: includeExt || false,
                getList: getList || false,
            });
            res.status(200).send(fileNames);
        } else {
            throw new Error("Required Mandatory Params");
        }
    } catch (error: any) {
        Logger.error(error?.message);
        return res
            .status(500)
            .send({ status: false, message: error?.message || "" });
    }
});

// * // Health Check Route //
router.get("/ping", (req: Request, res: Response) =>
    res.status(200).json({ message: "pong" })
);

// ! // Error Routes //
router.get("*", (req: Request, res: Response) => {
    return res
        .status(404)
        .send({ status: false, message: "[ ❌ ] Route Not Found!", data: [] });
});

// ! // Error Routes //
router.post("*", (req: Request, res: Response) => {
    return res
        .status(404)
        .send({ status: false, message: "[ ❌ ] Route Not Found!", data: [] });
});

// @ // Export SMS Router //
export default router;
