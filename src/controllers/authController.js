const router = require("express").Router();

const { isGuest, isAuth } = require('../middlewares/authMiddlware')
const authService = require("../services/authService");
const { getErrorMessage } = require("../utils/errorUtils");

router.get("/register", isGuest, (req, res) => {
  res.render("auth/register");
});

router.post("/register", isGuest, async (req, res) => {
  const userData = req.body;

  try {
    const token = await authService.register(userData);
    res.cookie("auth", token);
    res.redirect("/");
} catch (error) {
    const message = getErrorMessage(error);
    res.render("auth/register", {...userData, error: message });
  }
});

router.get("/login", isGuest, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isGuest, async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    res.cookie("auth", token);
    res.redirect("/");
  } catch (error) {
    res.render('auth/login', {email, error: getErrorMessage(error)})
  }
});

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie("auth");
  res.redirect("/");
});

module.exports = router;
