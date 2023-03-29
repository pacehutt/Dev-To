import { UserContext } from "@/lib/context";
import { useContext } from "react";
import { SignOutButton } from "@/pages/enter";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";

// UI component for user profile
export default function UserProfile({ user }) {
  const u = useContext(UserContext);

  const displayName = u?.user?.displayName.split(" ").slice(0, 2).join(" ");
  const router = useRouter();
  const { username } = router.query;
  return (
    <div className="box-center">
      <img
        src={
          user.photoURL ||
          "https://png.pngtree.com/png-vector/20200628/ourmid/pngtree-hacker-cool-png-illustration-png-image_2265676.jpg"
        }
        className="card-img-center"
      />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{displayName || "Anonymous User"}</h1>

      {username === u?.username && (
        <button
          className="btn-red"
          style={{
            width: "150px",
            margin: "0 auto",
          }}
          onClick={() => {
            auth.signOut();
            router.push("/enter");
          }}
        >
          Sign Out
        </button>
      )}
    </div>
  );
}
