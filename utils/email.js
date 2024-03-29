const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

const newTransport = () => {
  if (process.env.NODE_ENV === 'production') {
    //sendgrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      //didn't get a sendgrid account, just to show as example
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

//send the actual email
async function send(user, url, template, subject) {
  const to = user.email;
  const firstName = user.name.split(' ')[0];
  const from = `Milly <${process.env.EMAIL_FROM}>`;

  //render HTML based on a pug template
  // res.render('')
  const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
    firstName,
    url: url,
    subject,
  });

  //define email options
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html,
    text: htmlToText(html),
  };

  // create a transport and send email
  await newTransport().sendMail(mailOptions);
}

async function sendWelcome(user, url) {
  await send(user, url, 'welcome', 'Welcome to the Natours Family!');
}
async function sendPasswordReset(user, url) {
  await send(
    user,
    url,
    'passwordReset',
    'Your password reset token (valid for 10 min)',
  );
}

module.exports = { sendWelcome, sendPasswordReset };
