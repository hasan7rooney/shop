import * as express from "express";
const router = express.Router();
import auth from "../../middleware"
import UserController from "../../controllers/app/user.controller";

// create v1
//// register
router.post("/register", UserController.register);
router.post("/otp",auth,UserController.otp)
router.post("/login",auth,UserController.login)
// router.post("/otp", auth ,UserController.otp)
//// login
//// categories
//// category products
//// check out
//// invoices
//// methods
//// notifications

export default router;
