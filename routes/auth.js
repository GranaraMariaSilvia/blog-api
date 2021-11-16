const router = require("express").Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const user = await newUser.save(); //guardo el nuevo usuario creado
    res.status(200).json(user); //me muestra el usuario creado
  } catch (error) {
    res.status(500).json(error);
  }
});

//Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }); //que busque un usuario con este nombre unico
    !user && res.status(400).json("usuario inexistente"); //valido si existe este usuario

    const validated = await bcrypt.compare(req.body.password, user.password); //aqui comparo las contraseñas
    !validated && res.status(400).json("contraseña incorrecta"); // hago la validacion de la contraseña

    const { password, ...others } = user._doc; //para que no muestre la contraseña pero si las otras propiedades

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
