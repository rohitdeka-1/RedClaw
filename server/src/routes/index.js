import { Router } from "express";
import { transporter } from "../services/mailer.services.js";
import path from "path";
import hbs from "nodemailer-express-handlebars"
import authRoutes from "./auth.route.js";
import prodRoute from "./product.route.js";
import cartRoute from "./cart.route.js";

const router = Router();


router.use("/auth",authRoutes);
router.use("/product",prodRoute);
router.use("/cart",cartRoute);


//handlebars
const hbsOptions = {
    viewEngine: {
        defaultLayout: false
    },
    viewPath: path.resolve("src/Email")
}

transporter.use('compile',hbs(hbsOptions))


export default router



