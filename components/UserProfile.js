// UI component for user profile
export default function UserProfile({ user }) {
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
      <h1>{user.displayName || "Anonymous User"}</h1>
    </div>
  );
}
