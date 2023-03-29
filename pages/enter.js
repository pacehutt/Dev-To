import { auth, googleAuthProvider, db } from "@/lib/firebase";

import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/context";
import debounce from "lodash.debounce";
import { writeBatch, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";

export default function Enter({}) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.png"} alt="google" /> Sign in with Google
    </button>
  );
}

export function SignOutButton() {
  return (
    <button className="btn-google" onClick={() => auth.signOut()}>
      {" "}
      Sign Out
    </button>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const router = useRouter();
  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const docRef = doc(db, "usernames", username);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          console.log("username not exists:");
          console.log("No such document!");
          setIsValid(true);
          setLoading(false);
        } else {
          console.log("username exists:");
          console.log("Document data:", docSnap.data());
          setIsValid(false);
          setLoading(false);
        }

        console.log("Firestore read executed");
      }
    }, 500),
    []
  );

  const onChange = (e) => {
    const value = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3
    if (value.length < 3) {
      setFormValue(value);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(value)) {
      setLoading(true);
      setIsValid(false);
      setFormValue(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const batch = writeBatch(db);

    const userDoc = doc(db, "users", user.uid);
    const usernameDoc = doc(db, "usernames", formValue);

    batch.set(userDoc, {
      email: user.email,
      photoURL: user.photoURL,
      username: formValue,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
    router.push("/");
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />

          <button className="btn-green" type="submit" disabled={!isValid}>
            Choose
          </button>

          {/* <h3>Debug state</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div> */}
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    if (username.length < 3)
      return <p className="text-danger">must be at least 3 characters</p>;

    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
