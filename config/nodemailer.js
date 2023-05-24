const nodemailer = require("nodemailer");
const config = require("config");

const user = config.get("user");
const pass = config.get("pass");

const transport = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  secureConnection: false,
  auth: {
    user: user,
    pass: pass,
  },
  tls: {
    rejectUnAuthorized: true,
  },
});

const sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log("Check");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch((err) => console.log(err));
};

module.export = sendConfirmationEmail;
