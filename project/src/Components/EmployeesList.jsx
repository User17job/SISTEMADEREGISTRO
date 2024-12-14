import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        setEmployees(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los empleados");
        setLoading(false);
        console.error("Error fetching employees:", err);
      }
    };

    fetchEmployees();
  }, []);

  const deleteEmployee = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        setEmployees(employees.filter((employee) => employee.id !== id));
        Swal.fire("Eliminado!", "El empleado ha sido eliminado.", "success");
      } catch (err) {
        console.error("Error deleting employee:", err);
        Swal.fire(
          "Error",
          "No se pudo eliminar el empleado. Inténtalo nuevamente.",
          "error"
        );
      }
    }
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="w-full p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">
        Gestión de Empleados
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{employee.nombre}</h3>
              <div className="space-x-4">
                <Link
                  to={`/employees/${employee.id}`}
                  className="text-blue-500 hover:underline">
                  Ver Detalles
                </Link>
                <button
                  onClick={() => deleteEmployee(employee.id)}
                  className="text-red-500 hover:underline">
                  Eliminar
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Departamento:</strong> {employee.departamento}
              </p>
              <p>
                <strong>Jefe de Área:</strong> {employee.jefeArea}
              </p>
              <p>
                <strong>Estado:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded ${
                    employee.estado === "Activo"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}>
                  {employee.estado}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
