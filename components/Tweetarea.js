/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState } from "react";
import Image from "next/image";
import twitter from "/public/TWlogo.webp";
import { PhotographIcon} from "@heroicons/react/outline";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import toast from "react-hot-toast";



const Tweetarea = () => {
 
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
 
  const username = user?.email.slice(0, user.email.search("@"));

  const sendPost = async () => {
    if(user){
      const sendDoc = await addDoc(collection(db, "posts"), {
        id: user?.uid,
        text: input,
        timestamp: serverTimestamp(),
        name: username,
      });
      const imageRef = ref(storage, `posts/${sendDoc.id}/image`);
  
      if (imageFile) {
        await uploadString(imageRef, imageFile, "data_url").then(async () => {
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "posts", sendDoc.id), {
            image: downloadURL,
          });
        });
      }
  
      setInput("");
      setImageFile(null);
    }else{
      toast.error("Lütfen Önce Oturum Açın")
      setInput("")
    }
  };

  const chooseImage = useRef(null);

  const addImage = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (e) => {
      setImageFile(e.target.result);
    };
  };
 const handleChange=(e)=>{
  setInput(e.target.value)
  
 }
  return (
    <div className="p-2 space-y-8">
      <div className="flex items-center space-x-2">
        <Image
          className="rounded-full"
          objectFit="contain"
          height={50}
          width={50}
          src={twitter}
          alt=""
        />
        <textarea
          value={input}
          onChange={handleChange}
          className="resize-none outline-none placeholder:text-xl h-10 flex-1 text-xl break-words"
          placeholder="Neler Oluyor?"
          type="text"
        />
        
      </div>
      {imageFile&&(
          <div>
            <img className="" alt="" src={imageFile}></img>
          </div>
        )}
      <div className="space-y-2">
        <div className="flex items-center justify-between  sm:ml-14 ">
          <div className="flex space-x-2">
            <input type="file" hidden ref={chooseImage} onChange={addImage} />
            <PhotographIcon
              onClick={() => chooseImage.current.click()}
              className=" w-8 text-[#00ACED] transition-all duration-300 ease-out hover:scale-125 cursor-pointer"
            />
          
          </div>
          <div>
            <button
              disabled={!input.trim()}
              onClick={sendPost}
              className="hover:brightness-90 transition-all duration-300 ease-out text-white px-4 py-2 font-semibold bg-[#00ACED] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tweetle
            </button>
          </div>
        </div>
    
      
      </div>
      <div>
    </div>
    </div>
  );
};

export default Tweetarea;
