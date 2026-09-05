import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { useAppDispatch } from "./store/hooks";
import { useMe } from "./hooks/use-me";
import { clearUser, setUser } from "./store/auth/auth.slice";
import { useEffect } from "react";

function App() {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useMe();

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    }
    if (isError) {
      dispatch(clearUser());
    }
  }, [dispatch, data, isError]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
}

export default App;
