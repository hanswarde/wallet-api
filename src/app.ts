import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import connectToMongoDB from "./config/mongodb";
import paymentRouter from "./routes/paymentRouter";
import walletRouter from "./routes/walletRouter";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

connectToMongoDB();

app.get("/ping", (_req: Request, res: Response) => {
  res.status(200).json("pong");
});

app.use("/api/v1", paymentRouter);
app.use("/api/v1", walletRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
