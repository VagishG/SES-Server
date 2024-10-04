import { Router } from "express";
import { sendOtp } from "../controller/sendOtp";
import { sendTemplateMail } from "../controller/sendTemplateMail";
import { handleBounce } from "../controller/handleBounce";

const router=Router();

router.route("/sendOtp").post(sendOtp);
router.route("/sendTemplateMail").post(sendTemplateMail);
router.route("/handleBounce").post(handleBounce);


export default router;