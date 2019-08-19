const sgMail = require("@sendgrid/mail");
require("dotenv").config({ path: ".env.development" });
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = sgMail;
