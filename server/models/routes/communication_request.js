const { Message, User } = require("../postgres");
const { ValidationError, Op } = require("sequelize");
const { Router } = require("express");
const checkAuthentication = require("../../middlewares/checkAuthentication");
const request = require("../postgres/entities/CommunicationRequest");
const { EventEmitter } = require("events");
const router = new Router();


const RequestEvents = new EventEmitter();

router.get("/communication_request", checkAuthentication, async (req, res) => {
    try {
        const result = await request.findAll();
       
        res.json(result);
    }
    catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});




router.post("/communication_request", async (req, res) => {
    try {
        const result = await request.create(req.body);
        console.log("result", result)
        RequestEvents.emit("contact", req.body);

         res.status(201).json(result);
    }
    catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json(error);
        }
        else {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
);

router.get("/communication_request/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await request.findByPk(req.params.id);
        if (result) {
            res.json(result);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

router.patch("/communication_request/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await request.update(req.body, {
            where: { id: req.params.id },
        });
        res.json(result);
    }
    catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json(error);
        }
        else {
            res.sendStatus(500);
            console.error(error);
        }
    }
});

router.delete("/communication_request/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await request.destroy({
            where: { id: req.params.id },
        });
        res.json(result);
    }
    catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

module.exports = router;

