import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserprofilePicture, updateUserCoverImage, additionalInfo } from "../controllers/user-controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
  ]), 
  registerUser 
);
  
router.route("/login").post(loginUser);

//secured routes
router.route('/logout').post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeCurrentPassword);
router.route("/current-user").get(verifyJWT,getCurrentUser);
router.route("/update-details").patch(verifyJWT,updateAccountDetails);


router.route("/profilePicture").patch(verifyJWT,upload.single("profilePicture"),updateUserprofilePicture);
router.route('/name').get((req,res)=>{
res.json({name:'abhisehkkk'})
})
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage);
router.route("/c/:username").get(verifyJWT,getUserChannelProfile);
router.route("/history").get(verifyJWT,getWatchHistory);
router.route('/additionalInfo').post(
  upload.fields([
    { name: 'DOCUMENTS', maxCount: 10 },   // Adjust maxCount based on your needs
    { name: 'UPLOADSPHOTOS', maxCount: 10 } // Adjust maxCount based on your needs
  ]),
  additionalInfo
);


export default router;
