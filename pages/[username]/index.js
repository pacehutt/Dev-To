import UserProfile from "@/components/UserProfile";
import PostFeed from "@/components/PostFeed";
import { db, getUserWithUsername, postToJSON } from "@/lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  where,
  query as Query,
} from "firebase/firestore";
import { useRouter } from "next/router";

// This function is called at build time
export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();

    const postsQuery = Query(
      collection(db, "users", userDoc.id, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    // retrieve the posts data using the query
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: {
      user,
      posts,
    },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
