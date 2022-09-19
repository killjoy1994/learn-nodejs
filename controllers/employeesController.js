const Employees = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employees.find();
  if (!employees) res.sendStatus(204).json({ message: "No employees found" });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .sendStatus(400)
      .json({ message: "Firstname and Lastname are required" });
  }

  try {
    const result = await Employees.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.sendStatus(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Id parameter is required" });
  }

  const employee = await Employees.findOne({ _id: req.body.id }).exec();

  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches with id: ${req.body.id}.` });
  }

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Id parameter is required!" });

  const employee = await Employees.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches with id: ${req.body.id}.` });
  }

  const result = await Employees.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return req.status(400).json({ message: "Employee ID required" });
  const employee = await Employees.findOne({ _id: req.params.id }).exec();
  if (!employee)
    return res
      .status(204)
      .json({ message: `No employee matches with id: ${req.params.id}.` });

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
