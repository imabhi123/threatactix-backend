import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, googleLoginUser, googleRegisterUser, loginUser, logoutUser, purchasePlan, refreshAccessToken, registerUser, updateAccountDetails, updateUserprofilePicture } from "../controllers/user-controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/register").post(
  registerUser
);
router.route("/google-register").post(
  googleRegisterUser
);

router.route("/login").post(loginUser);
router.route("/google-login").post(googleLoginUser);

//secured routes
router.route('/logout').post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeCurrentPassword);
router.route("/purchase-plan").post(purchasePlan);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-details").patch(verifyJWT,updateAccountDetails);


router.route("/profilePicture").patch(verifyJWT,upload.single("profilePicture"),updateUserprofilePicture);
router.route('/name').get((req,res)=>{
res.json({name:'abhisehkkk'})
})


export default router;
