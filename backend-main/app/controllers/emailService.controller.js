const nodemailer = require('nodemailer'); 

sendEmail = (firstName, email, verificationUrl) => {
    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      });
      var mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: process.env.MAIL_SUBJECT,
        text: 'For clients with plaintext support only',
        html: `<!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
            </head>
            <body>
                <p>
                Hi ${firstName},
                </p>
                <p>Thanks for registering on Target Catcher. You are requested to verify yourself.
                </p>
                <p>
                Please click on the link below to verify: <br>
                <a href='${verificationUrl}'>${verificationUrl}</a> <br>
                </p>
                <p>You have 48 hours to verify from the time this email was sent.</p><br>
                <p>
                Kind regards, <br>
                Target Catcher
                </p>
                <img src=${process.env.MAIL_IMAGE}>
            </body>
        </html>`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
}

const nodeMail = {
    sendEmail : sendEmail
}

module.exports = nodeMail;
