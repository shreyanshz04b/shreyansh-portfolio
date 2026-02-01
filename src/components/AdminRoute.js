import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function AdminRoute({ children }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setAuthorized(false);
        return;
      }

      if (user.user_metadata?.role !== "admin") {
        setAuthorized(false);
        return;
      }

      setAuthorized(true);
    };

    checkUser();
  }, []);

  if (authorized === null) return null; // loading

  return authorized ? children : <Navigate to="/adminlogin" replace />;
}
