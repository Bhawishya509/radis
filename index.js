import express from "express";
import dotenv from "dotenv";
import { createClient } from "redis";
import connectDB from "./database.js";
import modelsConnection from "./model/User.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redis client (v4+)
const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis error:', err));
await redisClient.connect();

connectDB('user_Details');

app.post("/post", async (req, res) => {
  const { name, notebook, subjects } = req.body;
  await connectDB("user_Details");
  let userModel = modelsConnection("user");
   await userModel.insertOne({ name, notebook, subjects });

  const redisKey = `user_data`;
  const redisData = {
    name,
    notebook,
    subjects: JSON.stringify(subjects)
  };

  // Redis hash set (Promise-based)
  await redisClient.hSet(redisKey, redisData);
  await redisClient.expire(redisKey, 1000);

  res.status(200).send(`Data inserted successfully in MongoDB and Redis`);
});

app.get("/", async (req, res) => {
  const data = await redisClient.hGetAll("user_data");
  if (Object.keys(data).length > 0) {
    data.subjects = JSON.parse(data.subjects);
    return res.status(200).json(data);
  } else {
    return res.send("no data found in redis");
  }
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(5000, () => {
  console.log("server is running on port", process.env.PORT);
});