import {
    auth,
    admin
} from "../config/firebase.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
} from "firebase/auth";

class AuthController {
    login(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: 'Email and password required' });
        }
        const email = req.body.email;
        const password = req.body.password;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const idToken = userCredential._tokenResponse.idToken
                if (idToken) {
                    res.cookie('access_token', idToken, {
                        httpOnly: false,
                        sameSite: 'None',
                        secure: true
                    });
                    res.status(200).json({ message: "User logged in successfully", userCredential });
                } else {
                    res.status(500).json({ error: "Internal Server Error" });
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                res.status(400).json({ error: errorMessage });
                console.log('Error:', error);
            });

    }


    register(req, res) {
        console.log(req.body);

        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        const email = req.body.email;
        const password = req.body.password;
        console.log(email, password);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        res.status(201).json({ message: "Verification email sent! User created successfully!" });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(500).json({ error: "from authcontroller1" });
                    });
            })
            .catch((error) => {
                const errorMessage = error.message || "An error occurred while registering user";
                console.log(error);

                res.status(500).json({ error: "from authcontroller2" });
            });
    }

    logout(req, res) {
        // console.log(req.cookies.access_token);
        signOut(auth)
            .then(() => {
                res.clearCookie('access_token');
                res.status(200).json({ message: "User logged out successfully" });
            })
            .catch((error) => {
                res.status(500).json({ error: "Internal Server Error" });
            });
    }

}

export default AuthController;

