const data = {
    employees: require("../model/employees.json"),
    setEmployees: function (data) {
        this.employees = data;
    }
};


const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createNewEmployee = (req, res) => {
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }

    if(!newEmployee.firstName || !newEmployee.lastName) {
        res.status(400).json({"message": "first and last names are required"})
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(200).json(data.employees);
}

const updateEmployee = (req, res) => {
   const employee = data.employees.find(emp => emp.id === +req.body.id);
   if(!employee) res.status(400).json({"message": `Employee with id: ${req.body.id} not found`})

   if(req.body.firstName) employee.firstName = req.body.firstName;
   if(req.body.lastName) employee.lastName = req.body.lastName;
   
   const filteredArray = data.employees.filter(emp => emp.id !== +req.body.id);
   const unsortedArray = [...filteredArray, employee];
   data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
   res.json(data.employees)
}

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === +req.body.id);
    if(!employee) res.status(400).json({"message": `Employee with id: ${req.body.id} not found`});

    const filteredArray = data.employees.filter(emp => emp.id !== +req.body.id);
    data.setEmployees([...filteredArray]);
    res.json(data.employees);
}

const getEmployee = (req, res) => {
    console.log(req)
    const employee = data.employees.find(emp => emp.id === +req.params.id);
    if(!employee) res.status(400).json({"message": `Employee with id: ${req.params.id} not found`});

    res.json(employee)
}

module.exports = {getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee};