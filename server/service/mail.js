const nodemailer = require('nodemailer')

class Mail{

    constructor(){
        this.transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        }) 
    }

    async SendActivationMail(email, link){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Account activation on "+process.env.API_URL,
            text:"",
            html:`
            <div>
                <h1>For activation click this:</h1>
                <a href="${link}">${link}</a>
            </div>
            `
        })
    }
}

module.exports = new Mail();