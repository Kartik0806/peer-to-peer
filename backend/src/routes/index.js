import AuthContoller from '../controllers/AuthContoller.js';
import MeetController from '../controllers/meetControllers.js';
import 'dotenv/config';
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const authContoller = new AuthContoller();
const meetController = new MeetController();
const hello = () => {
    console.log('Hello World');
}

router.get('/verifyUser', verifyToken, (req, res) => {
    res.status(200).json({ user : req.user });
});

router.post('/login', authContoller.login);
router.post('/register', authContoller.register); 
router.get('/logout', authContoller.logout);
router.post('/meet', meetController.joinMeet);
export default router;