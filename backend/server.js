import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (usually runs on port 8080, 5173, or 3000)
app.use(cors());

// Body parser
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/certificates", certificateRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Songket Legacy Hub API Server is running.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
