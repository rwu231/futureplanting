const express = require ('express');
const bodyParser = require ('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');

const nodemailer = require('nodemailer');

const app = express();

//view engine setup
app.engine('handlebars', exphbs({
    extname: "handlebars",
    //defaultLayout: "main-layout",
    layoutsDir: "views/"
}));



app.set("view engine", "handlebars");


app.use("/public",express.static(path.join(__dirname, "public")));

// body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.get('/', (req, res) => {
    res.render('contact', {layout: false});
      
});

app.post('/send', (req, res) => {
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Post Code: ${req.body.postcode}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
    `;

 // create reusable transporter object 
 let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    Auth: {
        user: 'futuristicrooftopgardens@gmail.com', // generated ethereal user
        pass: '123abctest'  // generated ethereal password
    },
    tls:{
        rejectUnauthorized:false
      }
    });
  
  // setup email data with unicode symbols
  let mailOptions = {
      from: '"ray" <futuristicrooftopgardens@gmail.com>', // sender address
      to: 'ray231090@gmail.com', // list of receivers
      subject: 'Issue with plant', // Subject line
      text: 'Hello can you please solve this?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', {msg:'Email has been sent'});
});
});

app.listen(3000, () => console.log('Server started...'));