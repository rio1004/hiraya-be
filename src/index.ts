import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import authRoutes from "./routes/auth.routes.js";
const app: Application = express();
const port: number = 4000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/products", productRoutes);
app.use("/category", categoryRoutes);
app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
