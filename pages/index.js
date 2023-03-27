import Head from "next/head";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  startAfter,
} from "firebase/firestore";
import { db, fromMillis, postToJSON } from "@/lib/firebase";
import PostFeed from "@/components/PostFeed";
import { useState } from "react";

//No of posts to be fetched per page
const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = query(
    collectionGroup(db, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  console.log(posts);
  return {
    props: {
      posts,
    },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);

  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);

    const last = posts[posts.length - 1];
    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const q = query(
      collectionGroup(db, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(q)).docs.map(postToJSON);

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load More</button>
      )}
      <Loader show={loading} />
      {postsEnd && "You have reached the end!"}
    </main>
  );
}
