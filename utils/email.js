const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "CrewsNetOrg@gmail.com", // generated ethereal user
            pass: "CrewsNetIIIT21", // generated ethereal password
        },
        from: "CrewsNetOrg@gmail.com"
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'CrewsNetOrg <CrewsNetOrg.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
            // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;