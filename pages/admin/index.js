import styles from "@/styles/Admin.module.css";
import AuthCheck from "@/components/AuthCheck";
import PostFeed from "@/components/PostFeed";
import { UserContext } from "@/lib/context";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import kebabCase from "lodash.kebabcase";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from "react-hot-toast";

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList></PostList>
        <CreateNewPost></CreateNewPost>
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const userRef = doc(db, "users", auth.currentUser.uid);
  const postsRef = collection(userRef, "posts");
  const q = query(postsRef, orderBy("createdAt", "desc"));
  const [querySnapshot] = useCollection(q);
  //  this useCollection hook is from react-firebase-hooks/firestore and is used to read the data in real time
  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts!</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // this encodeURI is strips out special characters and makes them url safe, it is inbuilt browser function
  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();

    const docRef = doc(
      collection(db, "users", auth.currentUser.uid, "posts"),
      slug
    );
    await setDoc(docRef, {
      title,
      slug,
      uid: auth.currentUser.uid,
      username,
      published: false,
      content: "# hello world",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    });

    toast.success("Post created!");

    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Title"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
