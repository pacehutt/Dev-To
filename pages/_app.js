import Navbar from "@/components/Navbar";
import { UserContext } from "@/lib/context";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

import { useUserData } from "@/lib/hooks";

export default function App({ Component, pageProps }) {
  const userData = useUserData();
  return (
    <>
      <UserContext.Provider value={userData}>
        <Navbar />
        <Toaster />
        <Component {...pageProps} />
      </UserContext.Provider>
    </>
  );
}
