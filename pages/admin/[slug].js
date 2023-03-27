import styles from "@/styles/Admin.module.css";
import AuthCheck from "@/components/AuthCheck";
import Metatags from "@/components/MetaTags";
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";

export default function AdminPostEdit({}) {
  return (
    <AuthCheck>
      <Metatags title="admin-page"></Metatags>
      <PostManager></PostManager>
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(
    collection(db, "users", auth.currentUser.uid, "posts"),
    slug
  );
  const post = useDocumentDataOnce(postRef)[0];
  return (
    <>
      <main className={styles.container}>
        {post && (
          <>
            <section>
              <h1>{post.title}</h1>
              <p>ID: {post.slug}</p>
              <PostForm
                postRef={postRef}
                defaultValues={{ content: post.content }}
                preview={preview}
              />
            </section>
            <aside>
              <h3>Tools</h3>
              <button onClick={() => setPreview(!preview)}>
                {preview ? "Edit" : "Preview"}
              </button>
              <Link href={`/${post.username}/${post.slug}`}>
                <button className="btn-blue">Live view</button>
              </Link>
            </aside>
          </>
        )}
      </main>
    </>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, reset, watch, handleSubmit, formState } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty, errors } = formState;

  console.log(defaultValues, "defaultValues");

  const updatePost = async ({ content, published }) => {
    console.log(typeof content);
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  console.log(errors, "errors");

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
        <textarea
          name="content"
          {...register("content", {
            required: { value: true, message: "content is required" },
            minLength: { value: 7, message: "content is too short" },
            maxLength: { value: 20000, message: "content is too long" },
          })}
        ></textarea>
        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            {...register("published")}
          />
          <label style={{ fontSize: "15px" }}>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isValid || !isDirty}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
