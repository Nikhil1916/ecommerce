import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import AppRoutes from "./routes/AppRoutes";
import { useAppDispatch } from "./store/hooks";
import { clearUser, setUser } from "./store/auth/auth.slice";
import { useMe } from "./hooks/use-me";

function App() {

  const dispatch = useAppDispatch();
  const location = useLocation();

  const isPublicRoute =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const { data, isError } = useMe(!isPublicRoute);

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [data, isError, dispatch]);

  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
}

export default App;