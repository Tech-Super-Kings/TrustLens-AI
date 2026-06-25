import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRedirect } from './components/RoleRedirect';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PasswordPlaceholderPage } from './pages/PasswordPlaceholderPage';
import { RegisterPage } from './pages/RegisterPage';

const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<LandingPage />} />
    </Route>

    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<PasswordPlaceholderPage mode="forgot" />} />
      <Route path="/reset-password" element={<PasswordPlaceholderPage mode="reset" />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<RoleRedirect />} />
      <Route element={<DashboardLayout />}>
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/dashboard/student" element={<DashboardPage role="student" />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['employer']} />}>
          <Route path="/dashboard/employer" element={<DashboardPage role="employer" />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['university']} />}>
          <Route path="/dashboard/university" element={<DashboardPage role="university" />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['government']} />}>
          <Route path="/dashboard/government" element={<DashboardPage role="government" />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/dashboard/admin" element={<DashboardPage role="admin" />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
