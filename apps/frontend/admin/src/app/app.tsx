import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import UsersPage from './pages/users-management/users-management';

export function App() {
  return (
    <div>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<UsersPage />} />
      </Routes>
    </div>
  );
}

export default App;
