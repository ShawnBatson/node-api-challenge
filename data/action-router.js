const express = require("express");
const actionModel = require("./helpers/actionModel");

const router = express.Router();

router.get("/", (req, res, next) => {
    actionModel
        .get(req.params.id)
        .then((action) => {
            res.status(200).json(action);
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/:id", validateActionID(), (req, res) => {
    res.status(200).json(req.action);
});

router.post("/:id", validateActionID(), (req, res, next) => {
    if (res.project_id !== req.params.id) {
        return res.status(404).json({
            message: "project does not exist",
        });
    }
    actionModel
        .insert(req.body)
        .then((action) => {
            res.status(201).json(action);
        })
        .catch((err) => {
            next(err);
        });
});

router.put(
    "/:id",
    validateActionData(),
    validateActionID(),
    (req, res, next) => {
        actionModel
            .update(req.params.id, req.body)
            .then((action) => {
                res.status(200).json(action);
            })
            .catch((err) => {
                next(err);
            });
    }
);

router.delete("/:id", validateActionID(), (req, res, next) => {
    actionModel
        .remove(req.params.id)
        .then((count) => {
            if (count > 0) {
                res.status(200).json({
                    message: "The action has been completed or removed",
                });
            } else {
                res.status(404).json({
                    message:
                        "The action you are trying to remove does not exist",
                });
            }
        })
        .catch((err) => {
            next(err);
        });
});

function validateActionData() {
    return (req, res) => {
        if (!req.body.description || !req.body.notes) {
            return res.status(400).json({
                message: "You are missing the action description or notes. ",
            });
        }
    };
}

function validateActionID() {
    return (req, res, next) => {
        actionModel
            .get(req.params.id)
            .then((action) => {
                if (action) {
                    req.action = action;
                    next();
                } else {
                    res.status(404).json({
                        message: "No actions exist",
                    });
                }
            })
            .catch((err) => {
                next(err);
            });
    };
}

module.exports = router;
