const express = require("express");
const { get } = require("express/lib/response");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");


router.route("/")
    .get(employeesController.getAllEmployees)
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

    router.route("/:id")
        .get(employeesController.getEmployee)

module.exports = router;