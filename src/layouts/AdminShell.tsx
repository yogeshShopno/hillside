import { Outlet } from 'react-router-dom';

export default function AdminShell() {
  // Admin pages should not show the public header/footer.
  return <Outlet />;
}


