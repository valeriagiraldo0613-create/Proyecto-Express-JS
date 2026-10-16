import express, { Request, Response } from "express";
import cors from "cors";
import apiRoutes from "./routes/index";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", apiRoutes);

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "ControlLabs API operando correctamente",
    timestamp: new Date().toISOString()
  });
});

export default app;