import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useWindowSize } from "react-use";

import { useIsAuthenticated } from "../utils/is-authenticated";
import { Sidebar } from "../components/sidebar";
import { useDocumentTitle } from "../utils/use-document-title";
import { Container } from "../components/container";
import { DashboardHeader } from "../components/dashboard-header";

const Dashboard = () => {
  const isAuthenticated = useIsAuthenticated();
  const { width } = useWindowSize();
  const [isSidebarOpen, setIsSidebarOpen] = useState(width >= 1024);
  const sidebarRef = useRef(null);

  useDocumentTitle("Dashboard | Blogify");

  useEffect(() => {
    if (width >= 1024) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [width]);

  // Close sidebar when clicked outside and window size is less than 1024px
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

  // If user is not authenticated redirect them to sign in page
  if (!isAuthenticated) return <Navigate to="/sign-in" />;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-full lg:order-last">
        {/* Dashboard Header */}
        <DashboardHeader onClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <Container className="relative flex flex-col overflow-y-auto overflow-x-hidden pt-4">
          <div className="">Dashboard</div>
          {/* Dashboard Content */}
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

export default Dashboard;
