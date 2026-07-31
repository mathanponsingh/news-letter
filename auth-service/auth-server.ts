import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.get("/api/me", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.status(200).json(session);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
