import { UserContext } from "@/lib/context";
import { useContext } from "react";
import { SignOutButton } from "@/pages/enter";
import { auth } from "@/lib/firebase";
import { withRouter } from "next/router";

// UI component for user profile
function UserProfile({ user, router }) {
  const u = useContext(UserContext);

  const displayName = u?.user?.displayName.split(" ").slice(0, 2).join(" ");
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
        {username === u?.username ? (
          <i>@{user.username}</i>
        ) : (
          <i>@{username}</i>
        )}
      </p>
      <h1>{username === u?.username ? <>{displayName}</> : <>{username}</>}</h1>

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

export default withRouter(UserProfile);
