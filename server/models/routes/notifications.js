const { Router } = require("express");
const { EventEmitter } = require("events");

const checkAuthentication = require("../../middlewares/checkAuthentication");

const router = new Router();
const notificationsEvent = new EventEmitter();

router.get("/notifications", async (req, res) => {
    
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    // // listen to notification event
     notificationsEvent.on("notification", (data) => {
        res.write(`event: notification\ndata: ${JSON.stringify(data)}\n\n`);

     });
});

router.post("/notifications", checkAuthentication, async (req, res) => {
    notificationsEvent.emit("notification", req.body.message);
    res.sendStatus(201);
});
    
    

module.exports = router;
