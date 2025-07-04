let nodemailer = require('nodemailer');
exports.sendMail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saikirthan1234@gmail.com',
    pass: 'qwvs mgnm sqyu zemq'
  }
});

let mailOptions = {
  from: 'saikirthan1234@gmail.com',
  to, 
  subject,
  text
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}

