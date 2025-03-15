class MeetController{

    joinMeet(req, res) {
        const meet_code = req.body.meetCode;
        console.log(meet_code);
        res.status(200).json({ message: "Meet joined successfully" });

    }

}

export default MeetController;