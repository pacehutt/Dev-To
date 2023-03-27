import { auth, db, increment } from "@/lib/firebase";
import { collection, doc, writeBatch } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

export default function Heart({ postRef }) {
  const heartRef = doc(postRef, "hearts", auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);
  console.log(heartDoc?.exists());

  const removeHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(db);
    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef, { uid });

    await batch.commit();
  };

  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(db);
    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}> 💔 Unheart</button>
  ) : (
    <button onClick={addHeart}> ❤️ Heart</button>
  );
}
