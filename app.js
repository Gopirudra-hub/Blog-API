require("dotenv").config();
const cors = require('cors');

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
/*const authenticateUser = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const orderRouter = require("./routes/order");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");*/

app.use(express.json());

/*app.use(cors({
   origin: 'https://front-task-five.vercel.app', 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials:true
}));*/
app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

// routes
/*app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/auth", authenticateUser, orderRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);*/

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
