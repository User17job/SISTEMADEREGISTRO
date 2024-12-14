import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [editableEmployee, setEditableEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employees/${id}`
        );
        setEmployee(response.data);
        setEditableEmployee(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los detalles del empleado");
        setLoading(false);
        console.error("Error fetching employee details:", err);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const handleInputChange = (field, value) => {
    setEditableEmployee({ ...editableEmployee, [field]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/employees/${id}`,
        editableEmployee
      );
      setEmployee(editableEmployee);
      alert("Información actualizada exitosamente");
    } catch (err) {
      console.error("Error saving employee details:", err);
      alert("Error al guardar los cambios");
    }
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!employee) return <div>Empleado no encontrado</div>;

  return (
    <div className="w-full p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white border-b">
          <h2 className="text-3xl font-bold">Perfil del Empleado</h2>
          <p className="text-sm">ID: {employee.id}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Información Personal
            </h3>
            <div className="space-y-4">
              {[
                { label: "Nombre", field: "nombre" },
                { label: "Departamento", field: "departamento" },
                { label: "Jefe de Área", field: "jefeArea" },
                { label: "Correo Electrónico", field: "correoElectronico" },
                { label: "Teléfono", field: "telefono" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-gray-600 font-medium mb-1">
                    {label}:
                  </label>
                  <input
                    type="text"
                    value={editableEmployee[field] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="border rounded-lg w-full p-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Registro de Asistencia
            </h3>
            <div className="space-y-4">
              {[
                { label: "Fecha", field: "fecha", type: "date" },
                { label: "Entrada", field: "entrada", type: "time" },
                {
                  label: "Inicio Almuerzo",
                  field: "horaSAlmuerzo",
                  type: "time",
                },
                { label: "Fin Almuerzo", field: "horaEAlmuerzo", type: "time" },
                { label: "Salida", field: "salida", type: "time" },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="block text-gray-600 font-medium mb-1">
                    {label}:
                  </label>
                  <input
                    type={type || "text"}
                    value={editableEmployee[field] || ""}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="border rounded-lg w-full p-2 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Descripción
          </h3>
          <textarea
            value={editableEmployee.descripcion || ""}
            onChange={(e) => handleInputChange("descripcion", e.target.value)}
            className="border rounded-lg w-full p-2 focus:ring-blue-400 focus:border-blue-400"
            rows="5"></textarea>
        </div>

        <div className="px-6 py-4 flex justify-end space-x-4">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
