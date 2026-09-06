import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { useAppDispatch } from "./store/hooks";
import { useMe } from "./hooks/use-me";
import { clearUser, setUser } from "./store/auth/auth.slice";
import { useEffect, useState } from "react";
import Loader from "./components/common/Loader";

function App() {
  const dispatch = useAppDispatch();
  const [authReady, setAuthReady] = useState(false);
  const { data, isLoading, isError } = useMe();

  useEffect(() => {
      console.log("ME DATA:", data);
  console.log("ME ERROR:", isError);
  if(isLoading) {
    console.log("ME LOADING:", isLoading);
    return;
  }
    if (data?.data) {
      dispatch(setUser(data.data));
    }
    if (isError) {
      dispatch(clearUser());
    }
    setAuthReady(true);
    console.log("Auth Ready:", authReady);
  }, [dispatch, data, isError]);
  if (isLoading || !authReady) {
    return <Loader/>;
  }
  return (
    <>
      <Toaster position="top-right" />
      <AppRoutes />
    </>
  );
}

export default App;
