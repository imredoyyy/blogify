import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useWindowSize } from "react-use";
import { useIsAuthenticated } from "../utils/is-authenticated";
import { Sidebar } from "../components/sidebar";
import { Container } from "../components/container";
import { DashboardHeader } from "../components/dashboard-header";
import { Dashboard } from "../components/dashboard";

const DashboardPage = () => {
  const isAuthenticated = useIsAuthenticated();
  const { pathname } = useLocation();
  const { width } = useWindowSize();
  const [isSidebarOpen, setIsSidebarOpen] = useState(width >= 1024);
  const sidebarRef = useRef(null);

  useEffect(() => {
    setIsSidebarOpen(width >= 1024);
  }, [width]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        width < 1024
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [width]);

  if (!isAuthenticated) return <Navigate to="/sign-in" />;

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <div className="w-full overflow-y-auto lg:order-last">
        <DashboardHeader onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <Container className="relative flex flex-col pt-4">
          {pathname === "/dashboard" && <Dashboard />}
          <Outlet />
        </Container>
      </div>
      <Sidebar
        ref={sidebarRef}
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;
