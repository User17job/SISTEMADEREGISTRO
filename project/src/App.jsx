import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import { AddEmployeeForm } from "./Components/AddEmployee.jsx";

import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Dashboard } from "./Components/Dashboard.jsx";
import { EmployeeProfile } from "./Components/EmployeeProfile.jsx";
import { EmployeesList } from "./Components/EmployeesList.jsx";
import { Attendance } from "./Components/Attendance.jsx";
// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKs2mby1Q_9DrqALfxVhj7RGMe1sxcukA",
  authDomain: "sistema-de-asistencia-957d3.firebaseapp.com",
  projectId: "sistema-de-asistencia-957d3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//              :)
// Mock Employee Data
// const employeesData = [
//   {
//     id: 1,
//     nombre: "Juan Pérez",
//     fecha: "2024-02-15",
//     entrada: "08:30",
//     horaSAlmuerzo: "12:00",
//     horaEAlmuerzo: "13:00",
//     salida: "17:45",
//     estado: "Activo",
//     jefeArea: "María González",
//     descripcion:
//       "Desarrollador senior con 5 años de experiencia en desarrollo web. Especializado en tecnologías frontend.",
//     departamento: "Desarrollo",
//     correoElectronico: "juan.perez@empresa.com",
//     telefono: "+52 55 1234 5678",
//   },
//   {
//     id: 2,
//     nombre: "Ana Gómez",
//     fecha: "2024-02-15",
//     entrada: "09:15",
//     horaSAlmuerzo: "12:30",
//     horaEAlmuerzo: "13:30",
//     salida: "18:00",
//     estado: "Activo",
//     jefeArea: "Carlos Rodríguez",
//     descripcion:
//       "Diseñadora UX/UI con amplia experiencia en diseño de interfaces y experiencia de usuario.",
//     departamento: "Diseño",
//     correoElectronico: "ana.gomez@empresa.com",
//     telefono: "+52 55 8765 4321",
//   },
// ];
//              :)
// // Dashboard Component
// const Dashboard = () => (
//   <div className="w-full p-6 text-blue-900">
//     <h2 className="text-3xl font-bold mb-4 text-center">
//       Resumen de Empleados
//     </h2>
//     <div className="bg-white rounded-lg shadow-lg">
//       <table className="w-full">
//         <thead className="bg-blue-100">
//           <tr>
//             <th className="p-3 text-left">Nombre</th>
//             <th className="p-3 text-left">Entrada</th>
//             <th className="p-3 text-left">Inicio Almuerzo</th>
//             <th className="p-3 text-left">Fin Almuerzo</th>
//             <th className="p-3 text-left">Salida</th>
//             <th className="p-3 text-left">Acciones</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employeesData.map((employee) => (
//             <tr key={employee.id} className="border-b">
//               <td className="p-3">{employee.nombre}</td>
//               <td className="p-3">{employee.entrada}</td>
//               <td className="p-3">
//                 <EditableTime
//                   initialTime={employee.horaSAlmuerzo}
//                   onTimeChange={(newTime) => {
//                     // Implement update logic
//                     console.log(
//                       `Updated lunch start time for ${employee.nombre} to ${newTime}`
//                     );
//                   }}
//                 />
//               </td>
//               <td className="p-3">
//                 <EditableTime
//                   initialTime={employee.horaEAlmuerzo}
//                   onTimeChange={(newTime) => {
//                     // Implement update logic
//                     console.log(
//                       `Updated lunch end time for ${employee.nombre} to ${newTime}`
//                     );
//                   }}
//                 />
//               </td>
//               <td className="p-3">{employee.salida}</td>
//               <td className="p-3">
//                 <Link
//                   to={`/employees/${employee.id}`}
//                   className="text-blue-500 hover:underline">
//                   Ver Perfil
//                 </Link>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

//              :)
// // Editable Time Component
// const EditableTime = ({ initialTime, onTimeChange }) => {
//   const [time, setTime] = useState(initialTime);
//   const [isEditing, setIsEditing] = useState(false);

//   const handleBlur = () => {
//     setIsEditing(false);
//     onTimeChange(time);
//   };

//   if (isEditing) {
//     return (
//       <input
//         type="time"
//         value={time}
//         onChange={(e) => setTime(e.target.value)}
//         onBlur={handleBlur}
//         className="border rounded px-2 py-1"
//         autoFocus
//       />
//     );
//   }

//   return (
//     <span
//       onClick={() => setIsEditing(true)}
//       className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
//       {time}
//     </span>
//   );
// };

// // Añadiremos esta función al conjunto de datos existente
// const AddEmployee = (newEmployee) => {
//   const newId = employeesData.length + 1;
//   const employeeWithId = { ...newEmployee, id: newId };
//   employeesData.push(employeeWithId);
//   return employeeWithId;
// };

// Detailed Employee Profile
// const EmployeeProfile = () => {
//   const { id } = useParams();
//   const employee = employeesData.find((emp) => emp.id === parseInt(id));

//   if (!employee) {
//     return <div>Empleado no encontrado</div>;
//   }

//   return (
//     <div className="w-full p-6">
//       <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
//         <div className="px-6 py-4 bg-blue-100 border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-blue-800">
//             {employee.nombre}
//           </h2>
//           <p className="text-blue-600">{employee.departamento}</p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6 p-6">
//           <div>
//             <h3 className="text-xl font-semibold mb-4">Información Personal</h3>
//             <div className="space-y-2">
//               <p>
//                 <strong>Jefe de Área:</strong> {employee.jefeArea}
//               </p>
//               <p>
//                 <strong>Correo Electrónico:</strong>{" "}
//                 {employee.correoElectronico}
//               </p>
//               <p>
//                 <strong>Teléfono:</strong> {employee.telefono}
//               </p>
//               <p>
//                 <strong>Estado:</strong>
//                 <span
//                   className={`ml-2 px-2 py-1 rounded ${
//                     employee.estado === "Activo"
//                       ? "bg-green-200 text-green-800"
//                       : "bg-red-200 text-red-800"
//                   }`}>
//                   {employee.estado}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <div>
//             <h3 className="text-xl font-semibold mb-4">
//               Registro de Asistencia
//             </h3>
//             <div className="space-y-2">
//               <p>
//                 <strong>Fecha:</strong> {employee.fecha}
//               </p>
//               <p>
//                 <strong>Entrada:</strong> {employee.entrada}
//               </p>
//               <p>
//                 <strong>Inicio Almuerzo:</strong> {employee.horaSAlmuerzo}
//               </p>
//               <p>
//                 <strong>Fin Almuerzo:</strong> {employee.horaEAlmuerzo}
//               </p>
//               <p>
//                 <strong>Salida:</strong> {employee.salida}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="px-6 py-4 bg-gray-100">
//           <h3 className="text-xl font-semibold mb-2">Descripción</h3>
//           <p>{employee.descripcion}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

//              :)
// Employees List Component
// const EmployeesList = () => {
//   return (
//     <div className="w-full p-6">
//       <h2 className="text-3xl font-bold mb-4 text-center">
//         Gestión de Empleados
//       </h2>
//       <div className="grid md:grid-cols-2 gap-4">
//         {employeesData.map((employee) => (
//           <div key={employee.id} className="bg-white rounded-lg shadow-md p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold">{employee.nombre}</h3>
//               <Link
//                 to={`/employees/${employee.id}`}
//                 className="text-blue-500 hover:underline">
//                 Ver Detalles
//               </Link>
//             </div>
//             <div className="space-y-2">
//               <p>
//                 <strong>Departamento:</strong> {employee.departamento}
//               </p>
//               <p>
//                 <strong>Jefe de Área:</strong> {employee.jefeArea}
//               </p>
//               <p>
//                 <strong>Estado:</strong>
//                 <span
//                   className={`ml-2 px-2 py-1 rounded ${
//                     employee.estado === "Activo"
//                       ? "bg-green-200 text-green-800"
//                       : "bg-red-200 text-red-800"
//                   }`}>
//                   {employee.estado}
//                 </span>
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

//              :)
// Attendance Component
// const Attendance = () => {
//   const attendanceData = [
//     {
//       id: 1,
//       name: "Juan Pérez",
//       date: "2024-02-15",
//       checkIn: "08:30",
//       checkOut: "17:45",
//       status: "Completo",
//     },
//     {
//       id: 2,
//       name: "Ana Gómez",
//       date: "2024-02-15",
//       checkIn: "-",
//       checkOut: "-",
//       status: "Ausente",
//     },
//     {
//       id: 3,
//       name: "Carlos Martínez",
//       date: "2024-02-15",
//       checkIn: "09:15",
//       checkOut: "17:30",
//       status: "Tardanza",
//     },
//   ];

//   return (
//     <div className="w-full p-6 text-blue-900">
//       <h2 className="text-3xl font-bold mb-4 text-center">
//         Registro de Asistencia
//       </h2>
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-blue-100">
//             <tr>
//               <th className="p-3 text-left">Empleado</th>
//               <th className="p-3 text-left">Fecha</th>
//               <th className="p-3 text-left">Entrada</th>
//               <th className="p-3 text-left">Salida</th>
//               <th className="p-3 text-left">Estado</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendanceData.map((record) => (
//               <tr key={record.id} className="border-b">
//                 <td className="p-3">{record.name}</td>
//                 <td className="p-3">{record.date}</td>
//                 <td className="p-3">{record.checkIn}</td>
//                 <td className="p-3">{record.checkOut}</td>
//                 <td className="p-3">
//                   <span
//                     className={`px-2 py-1 rounded ${
//                       record.status === "Completo"
//                         ? "bg-green-200 text-green-800"
//                         : record.status === "Tardanza"
//                         ? "bg-yellow-200 text-yellow-800"
//                         : "bg-red-200 text-red-800"
//                     }`}>
//                     {record.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

//              :)
// Side Navigation Component
const SideNavigation = () => {
  const navItems = [
    { icon: "📊", label: "Dashboard", path: "/" },
    { icon: "👥", label: "Empleados", path: "/employees" },
    { icon: "➕", label: "Agregar Empleado", path: "/add-employee" },
    { icon: "📅", label: "Asistencia", path: "/attendance" },
  ];

  return (
    <div className="bg-blue-900 text-white w-64 h-full fixed left-0 top-0 pt-20">
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="p-4 hover:bg-blue-800">
              <Link to={item.path} className="flex items-center">
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Header Component
const Header = ({ user, onLogout }) => (
  <header className="fixed top-0 left-0 w-full bg-white shadow-md h-16 flex items-center justify-between px-6 z-10">
    <div className="flex items-center">
      <h1 className="text-xl font-bold text-blue-800">Sistema de Asistencia</h1>
    </div>
    <div className="flex items-center">
      <span className="mr-4">{user?.email || "Usuario"}</span>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Cerrar Sesión
      </button>
    </div>
  </header>
);

// Updated App Component with new Routes
const App = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Error al iniciar sesión");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Router>
      <div className="flex h-screen">
        {user && <SideNavigation />}
        <div className={`w-full flex flex-col ${user ? "ml-64" : ""}`}>
          {user && <Header user={user} onLogout={handleLogout} />}
          <main className={`h-full bg-gray-100 ${user ? "pt-16" : ""}`}>
            {user ? (
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeesList />} />
                <Route path="/employees/:id" element={<EmployeeProfile />} />
                <Route path="/add-employee" element={<AddEmployeeForm />} />
                <Route path="/attendance" element={<Attendance />} />
              </Routes>
            ) : (
              <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
                <div className="bg-white p-10 rounded-xl shadow-2xl w-96">
                  <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
                    🏢 Control de Asistencia
                  </h2>

                  {error && (
                    <div
                      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                      role="alert">
                      {error}
                    </div>
                  )}

                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mb-6">
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleLogin}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                      Iniciar Sesión
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
