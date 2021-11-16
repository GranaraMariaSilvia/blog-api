const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");

dotenv.config();

app.use(express.json()); //para evitar el error en postman

mongoose
  .connect(process.env.MONGO_URL) //aqui se elimino el  usenewurlparcer, usecreateindex
  .then(console.log("conectado a MongoDB"))
  .catch((error) => console.log(error));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, "helo jpg");
  },
});

const upload = multer({ storage: storage });

app.post("/servidor/upload", upload.single("file"), (req, res) => {
  res.status(200).json("el archivo se a subido");
});

app.use("/servidor/auth", authRoute);
app.use("/servidor/users", userRoute);
app.use("/servidor/posts", postRoute);
app.use("/servidor/categories", categoryRoute);

app.listen("5000", () => {
  console.log("Backend corriendo en el puerto 5000");
});
