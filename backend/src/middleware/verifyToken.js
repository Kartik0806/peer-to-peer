import { admin } from "../config/firebase.js";


const verifyToken = async (req, res, next) => {
    const idToken = req.cookies.access_token;
    if (!idToken) {
        console.log('No token provided');
        return res.status(200).json({ error: 'No token provided' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log('Decoded token:', decodedToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(200).json({ error: 'Unauthorized' });
    }
};

export default verifyToken;