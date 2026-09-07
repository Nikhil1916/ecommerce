import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { useAppDispatch } from "./store/hooks";
import { useMe } from "./hooks/use-me";
import { clearUser, setUser } from "./store/auth/auth.slice";
import { useEffect } from "react";

function App() {
  const dispatch = useAppDispatch();

  const { data, isError } = useMe();

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }

    if (isError) {
      dispatch(clearUser());
    }
  }, [dispatch, data, isError]);

  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
}

export default App;