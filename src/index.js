import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from "../src/routes/auth.route.js";
import userRoutes from "../src/routes/user.route.js";
import appsRoutes from "./routes/apps.route.js";
import featureRoutes from "./routes/features.route.js";
import subscribeRoutes from "./routes/subscription.route.js";
import planRoutes from "./routes/plans.route.js"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

dotenv.config()

const app = express()
const port = process.env.APP_PORT || 5000
// Middleware to parse JSON bodies
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());


app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.json({message:"Hello from Convertto Backend"});
})

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/apps",appsRoutes);
app.use("/api/v1/feature",featureRoutes);
app.use("/api/v1/plan",planRoutes);
app.use("/api/v1/subscribe",subscribeRoutes)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

export default app
