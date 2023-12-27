const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest: "public/"});
const { taskCollection } = require("../schema/taskSchema");

const { isUserLoggedIn } = require("./middlewares");
router.use(isUserLoggedIn);

router.post("/pic", upload.single("file"), async (req, res) => {
    const {taskTitle, taskBody} = req.body;
    const {originalname} = req.file;
    console.log(req.file);
    console.log(req.file.originalname);
    
    const newTask = await taskCollection.create({
        taskTitle, taskBody, pictureName: originalname, originalname
    });
    res.send({
        successful: true,
        newTask
    });

});


module.exports = router;