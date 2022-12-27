const Conversation = require("../postgres/entities/Conversation");
const checkAuthentication = require("../../middlewares/checkAuthentication");
const { Message, User } = require("../postgres");
const Participant = require("../postgres/entities/Participant");
const { ValidationError, Op } = require("sequelize");
const { Router } = require("express");

const router = new Router();

router.get("/conversations", checkAuthentication, async(req, res) => {
    try {
        const result = await Conversation.findAll({
            include: [
                {
                    model: Message,
                    as: "messages"
                },
                {
                    model: Participant,
                    as: "participants"
                }
            ]
        });
        // trier les conversations par date de dernier message
        result.sort((a, b) => {
            if (a.messages.length === 0) {
                return 1;
            }
            if (b.messages.length === 0) {
                return -1;
            }
            return b.messages[b.messages.length - 1].createdAt - a.messages[a.messages.length - 1].createdAt;
        });

        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

router.get("/myconversations/:userId", checkAuthentication, async (req, res) => {
    try {

        // Find Participant of the user
        const participants = await Participant.findAll({
            where: {
                userId: req.params.userId,
            },
        });
        // Find all conversations of the user
        const conversations = await Conversation.findAll({
            where: {
                id: {
                    [Op.in]: participants.map((participant) => participant.conversationId),
                },
            },
            include: [
                { model: Participant, as: "participants" },
                { model: Message, as: "messages" }
            ]
        });
        const users = await User.findAll();
        if (conversations.length === 0) {
            res.json([])
        } else {
            // trier les messages par date decroissante
            conversations.forEach((conversation) => {
                conversation.messages.sort((a, b) => b.createdAt - a.createdAt);
            });
            // trier les conversations par date de dernier message
            conversations.sort((a, b) => {
                if (a.messages.length === 0) {
                    return 1;
                }
                if (b.messages.length === 0) {
                    return -1;
                }
                return b.messages[b.messages.length - 1].createdAt - a.messages[a.messages.length - 1].createdAt;
            });
            // créer un objet lastMessage pour chaque conversation qui contient le dernier message de la conversation
            conversations.forEach((conversation) => {
                if (conversation.messages.length > 0) {
                    conversation.dataValues.lastMessage = conversation.messages[0];
                    conversation.dataValues.lastMessage.dataValues.author = users.find((user) => user.id === conversation.dataValues.lastMessage.authorId);
                }

            });
            res.json(conversations);
        }
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

router.post("/conversations", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.create(req.body);

         await Participant.create(
            {
                conversationId: result.id,
                userId: req.body.firstUserId
            }
        );
         await Participant.create(
            {
                conversationId: result.id,
                userId: req.body.secondUserId
            }
        );
        const results = await Conversation.findOne({
            where: { id: result.id },
            include: [
                { model: Participant, as: "participants" }
            ]
        });

        res.status(201).json(results);

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

// post conversation with many participants
router.post("/rooms", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.create(req.body);
    
        const participants = req.body.participants;

        if(participants) {
        participants.forEach(async (participant) => {
            await Participant.create(
                {
                    conversationId: result.id,
                    userId: participant.userId
                }
            );
        });
    }
        const results = await Conversation.findOne({
            where: { id: result.id },
            include: [
                { model: Participant, as: "participants" }
            ]
        });
        
        
        res.status(201).json(results);
        
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

router.put("/conversations/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.update(req.body, { where: { id: req.params.id } });
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

router.patch("/conversations/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.update(req.body, { where: { id: req.params.id } });
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

router.get("/conversations/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.findByPk(req.params.id, {
            include: [
                { model: Message, as: "messages"},
                { model: Participant, as: "participants" }
            ]
        });
        if (!result) {
            res.sendStatus(404);
        } else {
            res.json(result);
        }
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

router.delete("/conversations/:id", checkAuthentication, async (req, res) => {
    try {
        const result = await Conversation.destroy({ where: { id: req.params.id } });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
}
);

module.exports = router;