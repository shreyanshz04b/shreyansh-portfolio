import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AdminRoute({ children }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          setAuthorized(false);
          return;
        }

        // Strict role check
        if (user.user_metadata?.role !== "admin") {
          await supabase.auth.signOut();
          setAuthorized(false);
          return;
        }

        setAuthorized(true);
      } catch {
        setAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  if (authorized === null) return null; // wait

  if (!authorized) {
    return <Navigate to="/adminlogin" replace />;
  }

  return children;
}
