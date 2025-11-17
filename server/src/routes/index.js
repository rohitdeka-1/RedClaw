import { Router } from "express";

import authRoutes from "./auth.route.js";
const router = Router();


router.use("/auth",authRoutes);

export default router



//import authRoute from "./auth.route.js";
// import { transporter } from "../services/Mailer.js";
//import path from "path";

// import hbs from "nodemailer-express-handlebars"
// import roomRoute from "./Room.js";

// //handlebars
// const hbsOptions = {
//     viewEngine: {
//         defaultLayout: false
//     },
//     viewPath: path.resolve("MailTemplate")
// }

// transporter.use('compile',hbs(hbsOptions))


