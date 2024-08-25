import path from "path";
import express from "express"
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { v2 as cloudinary } from 'cloudinary'
import { app, server } from "./socket/socket.js";
import cors from "cors"
dotenv.config();
connectDB();
// const app =express();
const PORT=process.env.PORT||5000;
const __dirname = path.resolve();
cloudinary.config({
    cloud_name:process.env.CloudINARY_CLOUD_NAME,
    api_key:process.env.CloudINARY_API_KEY,
    api_secret:process.env.CloudINARY_API_SECRET

})
app.use(cors())
app.use(express.json({limit:"80mb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/messages',messageRoutes)

	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});

server.listen(PORT,()=>console.log(`server startde at http://localhost:${PORT}`));