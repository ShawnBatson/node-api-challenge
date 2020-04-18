const express = require("express");
const projectModel = require("./helpers/projectModel");

const router = express.Router();

router.get("/", (req, res, next) => {
    projectModel
        .get(req.params.id)
        .then((project) => {
            res.status(200).json(project);
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/:id", validateProjectID(), (req, res) => {
    res.status(200).json(req.project);
});

router.post("/", validateProjectData(), (req, res, next) => {
    projectModel
        .inster(req.body)
        .then((project) => {
            res.status(201).json(project);
        })
        .catch((err) => {
            next(err);
        });
});

router.put(
    "/:id",
    validateProjectData(),
    validateProjectID(),
    (req, res, next) => {
        projectModel
            .update(req.params.id, req.body)
            .then((project) => {
                res.status(200).json(project);
            })
            .catch((err) => {
                next(err);
            });
    }
);

router.delete("/:id", validateProjectID(), (req, res, next) => {
    projectModel
        .remove(req.params.id)
        .then((count) => {
            if (count > 0) {
                res.status(200).json({
                    message: "The project has been deleted",
                });
            } else {
                res.status(404).json({
                    message: "The project could not be found to delete",
                });
            }
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/:id/actions", validateProjectID(), (req, res, next) => {
    projectModel
        .getProjectActions(req.params.id)
        .then((actions) => {
            res.status(200).json(actions);
        })
        .catch((err) => {
            next(err);
        });
});

function validateProjectData() {
    return (req, res) => {
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({
                message: "Missing project name or description",
            });
        }
    };
}

function validateProjectID() {
    return (req, res, next) => {
        projectModel
            .get(req.params.id)
            .then((project) => {
                if (project) {
                    req.project = project;
                    next();
                } else {
                    res.status(404).json({
                        message: "Project not found",
                    });
                }
            })
            .catch((err) => {
                next(err);
            });
    };
}

module.exports = router;
