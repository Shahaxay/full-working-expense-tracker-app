const Sib = require('sib-api-v3-sdk');

const dotenv = require('dotenv');
dotenv.config();


exports.postResetPassword = async (req, res, next) => {
    // console.log(req.body);
    console.log(process.env.BREVO_API_KEY);
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const transEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
        email: 'shahaxay34@gmail.com',
        name:'Akshay'
    }

    const receiver = [
        {
            email: 'officialuse71@gmail.com'
        }
    ];

    transEmailApi.sendTransacEmail({
        sender,
        to:receiver,
        subject:"Reset password",
        textContent:`this is the email send to reset your google {{params.website}} password`,
        params:{
            website:'facebook'
        },
        htmlContent:'<h3>use the following link to reset your password</h3><a href="https://www.youtube.com/embed/7QeyD-nYhlc">click here</a>'
    })
    .then(console.log)
    .catch(console.log);
    res.json({});
}