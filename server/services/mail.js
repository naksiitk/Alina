// ******************************************************
//                      Node Mailer 
// ******************************************************

require('dotenv').config()


const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  
    host: 'smtp.gmail.com',
    port: 25,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.PASSWORD,
    }
});

exports.sendOTP_mail = async (req) => {
    var mailOptions = {
        from: 'noreply@silversoft.business',
        to: req.to,
        subject: 'OTP for signup on ALINA platform',
        html: `
        <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
            <h2>Welcome to ALINA</h2>
            <h4>You are officially in a mess</h4>
            <p style="margin-bottom: 30px;">Please enter the OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${req.OTP}</h1>
        </div>
        `,
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
};

