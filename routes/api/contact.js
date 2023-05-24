const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const config = require("config");

const Contact = require("../../models/Contact");

const nodemailer = require("nodemailer");

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, description, sender_Email } = req.body;

      let contact = new Contact({
        name,
        email,
        description,
        sender_Email,

      });

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
        subject: "Message From Travel Care",
        html: `<h1>Contact Details</h1>
            <h2>${name} has a message for you</h2>

            <p> ${description} </p>
            <br/>

            <p> Sender's Email: ${sender_Email} </p>
            <p>Thank you for messaging our team. Someone from our team will reach out to you soon.</p>
            <br/>
            </div>`,
      };

      let info = await transport.sendMail(mailOptions);

      contact.save();

      return res.status(200).send("Contact Created !");
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error");
    }
  }
);

// get all contacts will useremail
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const contacts = await Contact.find({ email: email });
    return res.status(200).json(contacts);
  } catch (error) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
