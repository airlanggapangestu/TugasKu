import { Routes, Route, Navigate } from "react-router-dom";
import { LayoutProvider } from "./context/LayoutContext";
import Layout from "./components/layout/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CreateTask from "./components/CreateTask";
import ActiveTasks from "./components/ActiveTasks";
import DoneTasks from "./components/DoneTasks";
import Categories from "./components/Categories";
import SettingsPage from "./components/Settings";
import Help from "./components/Help";

function App() {
  return (
    <LayoutProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CreateTask TANPA Layout (full page) */}
        <Route path="/create-task" element={<CreateTask />} />

        {/* Halaman dengan Layout (Sidebar + Topbar) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/active-tasks" element={<ActiveTasks />} />
          <Route path="/done" element={<DoneTasks />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<Help />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </LayoutProvider>
  );
}

export default App;
