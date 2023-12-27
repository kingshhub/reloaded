const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest: "public/"});
const { taskCollection } = require("../schema/taskSchema");

const { isUserLoggedIn } = require("./middlewares");
router.use(isUserLoggedIn);

router.post("/pic", upload.single("file"), async (req, res) => {
    const {taskTitle, taskBody} = req.body;
    const {fileName} = req.files[0];
    console.log(req.file);
    console.log(req.files[0]);
    
    const newTask = await taskCollection.create({
        taskTitle, taskBody, pictureName, fileName
    });
    res.send({
        successful: true,
        newTask
    });

});


module.exports = router;