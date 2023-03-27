import { db, getUserWithUsername, postToJSON } from "@/lib/firebase";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Metatags from "@/components/MetaTags";

export async function getStaticProps({ params }) {
  const { username, slug } = params;

  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(collection(db, "users", userDoc.id, "posts"), slug);
    post = postToJSON(await getDoc(postRef));

    path = postRef.path;
  }

  return {
    props: {
      post,
      path,
    },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collectionGroup(db, "posts"));

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = doc(db, props?.path);
  const [realtime] = useDocumentData(postRef);

  const post = realtime || props?.post;

  return (
    <main className={styles.container}>
      <Metatags title="post page"></Metatags>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
      </aside>
    </main>
  );
}
