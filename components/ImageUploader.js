import { auth, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import Loader from "./Loader";

const ImageUploader = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadFile = async (e) => {
    const file = Array.from(e.target.files)[0];

    const extension = file.type.split("/")[1];

    // makes the reference to the storage bucket location
    const path = `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`;
    const storageRef = ref(storage, path);
    setUploading(true);

    // starts the upload

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen to updates to upload task
    uploadTask.on("state_changed", (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(pct);

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      uploadTask
        .then(() => getDownloadURL(storageRef))
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
    });
  };

  return (
    <>
      <div className="box">
        <Loader show={uploading} />

        {uploading && <h3>{progress}%</h3>}
        {!uploading && (
          <>
            <label className="btn">
              📸 Upload Image
              <input
                type="file"
                accept="image/x-png,image/gif,image/jpeg"
                onChange={uploadFile}
              />
            </label>
          </>
        )}
        {downloadURL && (
          <code className="upload-snippet">{` ![alt](${downloadURL})`}</code>
        )}
      </div>
    </>
  );
};

export default ImageUploader;
