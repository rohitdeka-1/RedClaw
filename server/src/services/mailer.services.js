import nodemailer from "nodemailer";
import envConfig from "../config/env.config.js";



export const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: envConfig.GOOGLE_APP_GMAIL,
        pass: envConfig.GOOGLE_APP_PASSWORD
    }
});

 
export const sendMail = (to, subject, template, context = {}) => {    
    return transporter.sendMail(
        {
            from: "studyrhd@gmail.com",
            to,
            subject,
            template,
            context
        }
    );
}


