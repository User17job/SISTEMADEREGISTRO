import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AddEmployeeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    departamento: "",
    jefeArea: "",
    correoElectronico: "",
    telefono: "",
    estado: "Activo",
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0], // Current date
    entrada: "",
    horaSAlmuerzo: "",
    horaEAlmuerzo: "",
    salida: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.nombre ||
      !formData.departamento ||
      !formData.correoElectronico
    ) {
      setError("Por favor complete los campos obligatorios");
      return;
    }

    try {
      // Send POST request to backend to add employee
      const response = await axios.post(
        "http://localhost:5000/api/employees",
        formData
      );

      // Clear any previous errors
      setError("");

      // Navigate to employees list
      navigate("/employees");
    } catch (err) {
      setError("Error al agregar empleado: " + err.message);
      console.error("Error adding employee:", err);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-100 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-800">
            Agregar Nuevo Empleado
          </h2>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4"
            role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="nombre">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="departamento">
                Departamento *
              </label>
              <input
                type="text"
                id="departamento"
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="jefeArea">
                Jefe de Área
              </label>
              <input
                type="text"
                id="jefeArea"
                name="jefeArea"
                value={formData.jefeArea}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="correoElectronico">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="correoElectronico"
                name="correoElectronico"
                value={formData.correoElectronico}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="telefono">
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="estado">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="entrada">
                Hora de Entrada
              </label>
              <input
                type="time"
                id="entrada"
                name="entrada"
                value={formData.entrada}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="horaSAlmuerzo">
                Inicio Almuerzo
              </label>
              <input
                type="time"
                id="horaSAlmuerzo"
                name="horaSAlmuerzo"
                value={formData.horaSAlmuerzo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="horaEAlmuerzo">
                Fin Almuerzo
              </label>
              <input
                type="time"
                id="horaEAlmuerzo"
                name="horaEAlmuerzo"
                value={formData.horaEAlmuerzo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="salida">
              Hora de Salida
            </label>
            <input
              type="time"
              id="salida"
              name="salida"
              value={formData.salida}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
              Agregar Empleado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
