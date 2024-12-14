import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Dashboard Component
export const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employees");
        setEmployees(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar empleados");
        setLoading(false);
        console.error("Error fetching employees:", err);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="w-full p-6 text-blue-900">
      <h2 className="text-3xl font-bold mb-4 text-center">
        Resumen de Empleados
      </h2>
      <div className="bg-white rounded-lg shadow-lg">
        <table className="w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Departamento</th>
              <th className="p-3 text-left">Fin Almuerzo</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b">
                <td className="p-3">{employee.id}</td>
                <td className="p-3">{employee.nombre}</td>
                <td className="p-3">{employee.departamento}</td>
                <td className="p-3">{employee.horaEAlmuerzo}</td>
                <td className="p-3">
                  <Link
                    to={`/employees/${employee.id}`}
                    className="text-blue-500 hover:underline">
                    Ver Perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
