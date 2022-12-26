const checkAuthentication = require("../../middlewares/checkAuthentication");
const Participant = require("../postgres/entities/Participant");
const { ValidationError } = require("sequelize");
const { Router } = require("express");

const router = new Router();

router.get("/participants", checkAuthentication, async (req, res) => {
    try {
        const result = await Participant.findAll({ where: req.query });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

router.get("/participantsOfConversation/:idConversation", checkAuthentication, async (req, res) => {
    try {
        const participants = await Participant.findAll({ where: { conversationId: req.params.idConversation } });
        // get users of participants
        const result = await Promise.all(participants.map(async (participant) => {
            const user = await participant.getUser();
            return { ...participant.dataValues, user };
        }));
        console.log(result)
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);


router.post("/participants", checkAuthentication, async (req, res) => {
    try {
        const result = await Participant.create(req.body);
        // get conversation of participant
        const conversation = await result.getConversation();
        result.dataValues.conversation = conversation;
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof ValidationError) {
            console.error(error);
            res.status(422).json(formatError(error));
        } else {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
);

router.put("/participants/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Participant.update(req.body, { where: { id: req.params.id } });
        res.json(result);
    } catch (error) {
        if (error instanceof ValidationError) {
            console.error(error);
            res.status(422).json(formatError(error));
        } else {
            res.sendStatus(500);
            console.error(error);
        }
    }
}
);

router.get("/participants/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Participant.findOne({ where: { id: req.params.id } });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

router.delete("/participants/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Participant.destroy({ where: { id: req.params.id } });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

module.exports = router;