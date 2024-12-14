import React, { useState, useEffect } from "react";
import axios from "axios";

export const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [newRecord, setNewRecord] = useState({
    employeeId: "",
    date: "",
    checkInTime: "",
    lunchOut: "",
    lunchIn: "",
    checkOutTime: "",
    status: "",
  });
  const [editingRecord, setEditingRecord] = useState(null);

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/attendance"
        );
        setAttendanceData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error loading attendance records");
        setLoading(false);
        console.error("Error fetching attendance data:", err);
      }
    };

    fetchAttendanceData();
  }, []);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Validate time inputs
  const validateTimeInputs = (record) => {
    // Check if lunch times are valid if provided
    if (record.lunchOut && record.lunchIn) {
      if (record.lunchOut >= record.lunchIn) {
        throw new Error("Lunch out time must be before lunch in time");
      }
    }

    // Check if check-in time is before check-out time
    if (record.checkInTime >= record.checkOutTime) {
      throw new Error("Check-in time must be before check-out time");
    }
  };

  // Handle input changes
  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingRecord({ ...editingRecord, [name]: value });
    } else {
      setNewRecord({ ...newRecord, [name]: value });
    }
  };

  // Add a new record
  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      validateTimeInputs(newRecord);

      const recordToSubmit = {
        employeeId: parseInt(newRecord.employeeId),
        date: newRecord.date,
        status: newRecord.status,
        checkInTime: newRecord.checkInTime,
        checkOutTime: newRecord.checkOutTime,
        lunchOut: newRecord.lunchOut || null,
        lunchIn: newRecord.lunchIn || null,
      };

      const response = await axios.post(
        "http://localhost:5000/api/attendance",
        recordToSubmit
      );
      setAttendanceData([...attendanceData, response.data]);
      setNewRecord({
        employeeId: "",
        date: "",
        checkInTime: "",
        lunchOut: "",
        lunchIn: "",
        checkOutTime: "",
        status: "",
      });
      showNotification("Attendance record added successfully");
    } catch (err) {
      console.error("Error adding new record:", err);
      showNotification(
        err.response?.data?.message ||
          err.message ||
          "Error adding attendance record",
        "error"
      );
    }
  };

  // Update an existing record
  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    try {
      validateTimeInputs(editingRecord);

      const recordToUpdate = {
        id: editingRecord.id,
        employeeId: parseInt(editingRecord.employeeId),
        date: editingRecord.date,
        status: editingRecord.status,
        checkInTime: editingRecord.checkInTime,
        checkOutTime: editingRecord.checkOutTime,
        lunchOut: editingRecord.lunchOut || null,
        lunchIn: editingRecord.lunchIn || null,
      };

      const response = await axios.put(
        `http://localhost:5000/api/attendance/${editingRecord.id}`,
        recordToUpdate
      );

      // Update the record in the local state
      setAttendanceData((prevData) =>
        prevData.map((record) =>
          record.id === editingRecord.id ? response.data : record
        )
      );

      setEditingRecord(null);
      showNotification("Attendance record updated successfully");
    } catch (err) {
      console.error("Error updating record:", err);
      showNotification(
        err.response?.data?.message ||
          err.message ||
          "Error updating attendance record",
        "error"
      );
    }
  };

  // Render loading or error messages
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="w-full p-6 text-blue-900">
      {/* Notification component */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}>
          {notification.message}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-4 text-center">Attendance Record</h2>

      {/* Form for adding a new record */}
      <form
        className="mb-6 bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleAddRecord}>
        <h3 className="text-xl font-bold mb-4">Add Attendance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="mb-2">Employee ID</label>
            <input
              className="border p-2 rounded"
              type="number"
              name="employeeId"
              placeholder="Employee ID"
              value={newRecord.employeeId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Date</label>
            <input
              className="border p-2 rounded"
              type="date"
              name="date"
              value={newRecord.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Status</label>
            <select
              className="border p-2 rounded"
              name="status"
              value={newRecord.status}
              onChange={handleInputChange}
              required>
              <option value="">Select Status</option>
              <option value="Completo">Complete</option>
              <option value="Tardanza">Late</option>
              <option value="Ausente">Absent</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Check-in Time</label>
            <input
              className="border p-2 rounded"
              type="time"
              name="checkInTime"
              value={newRecord.checkInTime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Lunch Out (Optional)</label>
            <input
              className="border p-2 rounded"
              type="time"
              name="lunchOut"
              value={newRecord.lunchOut}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Lunch In (Optional)</label>
            <input
              className="border p-2 rounded"
              type="time"
              name="lunchIn"
              value={newRecord.lunchIn}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2">Check-out Time</label>
            <input
              className="border p-2 rounded"
              type="time"
              name="checkOutTime"
              value={newRecord.checkOutTime}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
          Add Record
        </button>
      </form>

      {/* Tabla de asistencia */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">ID Empleado</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Entrada</th>
              <th className="p-3 text-left">Salida Almuerzo</th>
              <th className="p-3 text-left">Entrada Almuerzo</th>
              <th className="p-3 text-left">Salida</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record) => (
              <tr key={record.id} className="border-b">
                <td className="p-3">{record.employeeId}</td>
                <td className="p-3">{record.date}</td>
                <td className="p-3">{record.checkInTime}</td>
                <td className="p-3">{record.lunchOut || "N/A"}</td>
                <td className="p-3">{record.lunchIn || "N/A"}</td>
                <td className="p-3">{record.checkOutTime}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      record.status === "Completo"
                        ? "bg-green-200 text-green-800"
                        : record.status === "Tardanza"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}>
                    {record.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    className="text-blue-500"
                    onClick={() => setEditingRecord({ ...record })}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario para editar un registro */}
      {editingRecord && (
        <form className="mt-6" onSubmit={handleUpdateRecord}>
          <h3 className="text-xl font-bold mb-4">Editar Asistencia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              ID del empleado
              <input
                className="border p-2"
                type="number"
                name="employeeId"
                placeholder="ID del empleado"
                value={editingRecord.employeeId}
                onChange={(e) => handleInputChange(e, true)}
                required
              />
            </label>
            <label>
              Fecha
              <input
                className="border p-2"
                type="date"
                name="date"
                value={editingRecord.date}
                onChange={(e) => handleInputChange(e, true)}
                required
              />
            </label>
            <label>
              Hora de entrada
              <input
                className="border p-2"
                type="time"
                name="checkInTime"
                value={editingRecord.checkInTime}
                onChange={(e) => handleInputChange(e, true)}
                required
              />
            </label>
            <label>
              Salida a almorzar
              <input
                className="border p-2"
                type="time"
                name="lunchOut"
                value={editingRecord.lunchOut || ""}
                onChange={(e) => handleInputChange(e, true)}
              />
            </label>
            <label>
              Entrada de almuerzo
              <input
                className="border p-2"
                type="time"
                name="lunchIn"
                value={editingRecord.lunchIn || ""}
                onChange={(e) => handleInputChange(e, true)}
              />
            </label>
            <label>
              Hora de salida
              <input
                className="border p-2"
                type="time"
                name="checkOutTime"
                value={editingRecord.checkOutTime}
                onChange={(e) => handleInputChange(e, true)}
                required
              />
            </label>
            <label>
              Estado
              <select
                className="border p-2"
                name="status"
                value={editingRecord.status}
                onChange={(e) => handleInputChange(e, true)}
                required>
                <option value="">Selecciona un estado</option>
                <option value="Completo">Completo</option>
                <option value="Tardanza">Tardanza</option>
                <option value="Ausente">Ausente</option>
              </select>
            </label>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded">
              Guardar Cambios
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setEditingRecord(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
