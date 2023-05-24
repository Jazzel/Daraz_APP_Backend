const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");
const { validationResult, check } = require("express-validator");
const User = require("./models/User");

const app = express();

const port = process.env.PORT || 5000;
const nodemailer = require("nodemailer");

const path = require("path");

const config = require("config");
const bodyParser = require("body-parser");

connectDB();

let env = process.env.NODE_ENV || "development";
console.log(env);

// if (
//   process.env.NODE_ENV === "production" ||
//   process.env.NODE_ENV === "staging"
// ) {

// }

const URL =
  env === "production"
    ? "https://travel-care.herokuapp.com"
    : "http://localhost:3000";

app.use(express.json({ extended: false }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/businesses", require("./routes/api/business"));
app.use("/api/discounts", require("./routes/api/discounts"));
app.use("/api/contacts", require("./routes/api/contact"));
app.use("/api/products", require("./routes/api/product"));

app.post(
  "/api/change-password",
  [
    check("password", "Password is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password, code } = req.body;

    try {
      const user = await User.findOne({
        email: email,
      });

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      console.log(user.name);
      if (user.confirmationCode !== code) {
        return res
          .status(404)
          .send({ message: "Something went wrong. Try Again !" });
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.save();

      return res.status(200).send({ message: "Password changed" });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

// @route    POST api/users
// @desc     Confirm User
// @access   Public
app.post("/api/verify-code/", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  if (user) {
    if (user.confirmationCode === req.body.code) {
      user.status = "Active";
      await user.save();
      return res
        .status(200)
        .send({ message: "User was confirmed successfully!" });
    } else {
      return res.status(404).send({ message: "Invalid code" });
    }
  }
});

app.post(
  "/api/send-email",
  [check("email", "Email is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    try {
      const user = await User.findOne({
        email: email,
      });

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      // TODO: send email !
      console.log("sending email ...");

      let transport = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        secureConnection: false,
        auth: {
          user: config.get("user"),
          pass: config.get("pass"),
        },
        tls: {
          rejectUnAuthorized: true,
        },
      });

      const mailOptions = {
        from: `${config.get("user")}`,
        to: email,
        subject: "Password Reset Request",
        html: `<h1>Password Reset Request</h1>
            <h2>Welcome ${user.name} to TravelCare</h2>
            <p>We heard you forgot your account. Here's the link to reset your  account password:</p>
            <a href=${URL}/reset/${email}/${user.confirmationCode}}>${URL}/reset/${email}/${user.confirmationCode}</a>
            <br/>
            <smaill>If the above link is not clickable, try copying and pasting it into the address bar of your web browser.</smaill>
            </div>`,
      };

      let info = await transport.sendMail(mailOptions);
      console.log(`Message Sent: ${info.messageId}`);
      return res.status(200).send({ message: "Email sent." });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);

app.post(
  "/api/verify",
  [
    check("code", "Code is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, code } = req.body;

    try {
      const user = await User.findOne({
        email: email,
      });

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      console.log(user.confirmationCode);

      if (user.confirmationCode !== code.trim()) {
        return res.status(404).send({ message: "Wrong Code." });
      }
      user.status = "Active";
      user.save();
      return res.status(200).send({ message: "User authorized" });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
  }
);
app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
