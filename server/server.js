const express = require("express");
const fs = require("fs").promises;
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Paths to JSON files
const EMPLOYEES_FILE = path.join(__dirname, "employees.json");
const ATTENDANCE_FILE = path.join(__dirname, "attendance.json");

// Read employees from JSON file
const readEmployees = async () => {
  try {
    const data = await fs.readFile(EMPLOYEES_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(EMPLOYEES_FILE, JSON.stringify([], null, 2));
      return [];
    }
    throw error;
  }
};

// Read attendance records from JSON file
const readAttendance = async () => {
  try {
    const data = await fs.readFile(ATTENDANCE_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(ATTENDANCE_FILE, JSON.stringify([], null, 2));
      return [];
    }
    throw error;
  }
};

// Write attendance records to JSON file
const writeAttendance = async (attendanceRecords) => {
  await fs.writeFile(
    ATTENDANCE_FILE,
    JSON.stringify(attendanceRecords, null, 2)
  );
};

// Write employees to JSON file
const writeEmployees = async (employees) => {
  await fs.writeFile(EMPLOYEES_FILE, JSON.stringify(employees, null, 2));
};

// Get all employees
// app.get("/api/employees", async (req, res) => {
//   try {
//     const employees = await readEmployees();
//     res.json(employees);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching employees", error: error.message });
//   }
// });
app.get("/api/employees", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Valores por defecto
  const employees = await readEmployees();
  const paginatedEmployees = employees.slice((page - 1) * limit, page * limit);
  res.json(paginatedEmployees);
});

// Add new employee
app.post("/api/employees", async (req, res) => {
  try {
    const employees = await readEmployees();

    // Generate new ID
    const newId =
      employees.length > 0
        ? Math.max(...employees.map((emp) => emp.id)) + 1
        : 1;

    // Create new employee object
    const newEmployee = {
      ...req.body,
      id: newId,
    };

    // Add new employee
    employees.push(newEmployee);

    // Write updated employees to file
    await writeEmployees(employees);

    res.status(201).json(newEmployee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding employee", error: error.message });
  }
});

// Get employee by ID
app.get("/api/employees/:id", async (req, res) => {
  try {
    const employees = await readEmployees();
    const employee = employees.find(
      (emp) => emp.id === parseInt(req.params.id)
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching employee", error: error.message });
  }
});
// Add attendance record
app.post("/api/attendance", async (req, res) => {
  try {
    const { employeeId, date, status, checkInTime, checkOutTime } = req.body;

    // Validate input
    const employees = await readEmployees();
    const employeeExists = employees.some((emp) => emp.id === employeeId);

    if (!employeeExists) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const attendanceRecords = await readAttendance();

    // Check if attendance record for this employee and date already exists
    const existingRecord = attendanceRecords.find(
      (record) => record.employeeId === employeeId && record.date === date
    );

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Attendance record for this date already exists" });
    }

    // Create new attendance record
    const newAttendanceRecord = {
      id:
        attendanceRecords.length > 0
          ? Math.max(...attendanceRecords.map((record) => record.id)) + 1
          : 1,
      employeeId,
      date,
      status,
      checkInTime,
      checkOutTime,
    };

    attendanceRecords.push(newAttendanceRecord);
    await writeAttendance(attendanceRecords);

    res.status(201).json(newAttendanceRecord);
  } catch (error) {
    res.status(500).json({
      message: "Error adding attendance record",
      error: error.message,
    });
  }
});
// Update employee
app.put("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEmployee = req.body;

    // Validate input
    const employees = await readEmployees();
    const employeeIndex = employees.findIndex((emp) => emp.id === parseInt(id));

    if (employeeIndex === -1) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the employee record
    employees[employeeIndex] = {
      ...employees[employeeIndex],
      ...updatedEmployee,
    };

    // Write updated employees back to file
    await writeEmployees(employees);

    res.json(employees[employeeIndex]);
  } catch (error) {
    res.status(500).json({
      message: "Error updating employee",
      error: error.message,
    });
  }
});

// Update attendance record
app.put("/api/attendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRecord = req.body;

    // Validate input
    const employees = await readEmployees();
    const employeeExists = employees.some(
      (emp) => emp.id === updatedRecord.employeeId
    );

    if (!employeeExists) {
      return res.status(404).json({ message: "Employee not found" });
    }

    let attendanceRecords = await readAttendance();

    // Find the record to update
    const recordIndex = attendanceRecords.findIndex(
      (record) => record.id === parseInt(id)
    );

    if (recordIndex === -1) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Update the record
    attendanceRecords[recordIndex] = {
      ...attendanceRecords[recordIndex],
      ...updatedRecord,
    };

    // Write updated records back to file
    await writeAttendance(attendanceRecords);

    res.json(attendanceRecords[recordIndex]);
  } catch (error) {
    res.status(500).json({
      message: "Error updating attendance record",
      error: error.message,
    });
  }
});

// Get all attendance records
app.get("/api/attendance", async (req, res) => {
  try {
    const attendanceRecords = await readAttendance();
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance records",
      error: error.message,
    });
  }
});

// Get attendance records for a specific employee
app.get("/api/attendance/:employeeId", async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employeeId);

    // Validate employee exists
    const employees = await readEmployees();
    const employeeExists = employees.some((emp) => emp.id === employeeId);

    if (!employeeExists) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const attendanceRecords = await readAttendance();
    const employeeAttendance = attendanceRecords.filter(
      (record) => record.employeeId === employeeId
    );

    res.json(employeeAttendance);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching employee attendance",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Delete a specific attendance record
app.delete("/api/attendance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let attendanceRecords = await readAttendance();

    // Find the record to delete
    const recordIndex = attendanceRecords.findIndex(
      (record) => record.id === parseInt(id)
    );

    if (recordIndex === -1) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Remove the record
    const deletedRecord = attendanceRecords.splice(recordIndex, 1);

    // Write updated records back to file
    await writeAttendance(attendanceRecords);

    res.json({ message: "Attendance record deleted", deletedRecord });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting attendance record",
      error: error.message,
    });
  }
});

// Delete all attendance records
app.delete("/api/attendance", async (req, res) => {
  try {
    // Clear all attendance records
    await writeAttendance([]);

    res.json({ message: "All attendance records deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting all attendance records",
      error: error.message,
    });
  }
});

// Delete a specific employee
// app.delete("/api/employees/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     let employees = await readEmployees();

//     // Find the employee to delete
//     const employeeIndex = employees.findIndex((emp) => emp.id === parseInt(id));

//     if (employeeIndex === -1) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Remove the employee
//     const deletedEmployee = employees.splice(employeeIndex, 1);

//     // Write updated employees back to file
//     await writeEmployees(employees);

//     res.json({ message: "Employee deleted", deletedEmployee });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error deleting employee",
//       error: error.message,
//     });
//   }
// });

app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  const employees = await readEmployees();
  const attendanceRecords = await readAttendance();

  const updatedEmployees = employees.filter((emp) => emp.id !== parseInt(id));
  const updatedAttendance = attendanceRecords.filter(
    (record) => record.employeeId !== parseInt(id)
  );

  if (employeeIndex === -1) {
    return res.status(404).json({ message: "Employee not found" });
  }

  await writeEmployees(updatedEmployees);
  await writeAttendance(updatedAttendance);

  res.json({ message: "Employee and associated attendance records deleted" });
});
