import Head from "next/head";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

export default function Home() {
  return (
    <main>
      {/* <Loader show></Loader> */}
      {/* <Link
        prefetch={false}
        href={{
          pathname: "/[username]",
          query: { username: "mafiz" },
        }}
      >
        <i>Mafiz's profile Link</i>
      </Link> */}

      <button onClick={() => toast.success("Hello toast!")}>Toast me</button>
    </main>
  );
}
