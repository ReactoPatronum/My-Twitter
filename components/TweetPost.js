/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import "moment/locale/tr";
import {
  HeartIcon,
  TrashIcon,
  XIcon,
  ChatAlt2Icon,
} from "@heroicons/react/outline";
import { useAuth } from "../context/AuthContext";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/solid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import Modal from "react-modal";
import { deleteObject, ref } from "firebase/storage";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const TweetPost = ({ post }) => {
  const { user } = useAuth();
  const [likes, setlikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [updateIt, setUpdateIt] = useState("");
  const [updateModal, setUpdateModal] = useState(false);
  const [comments, setComments] = useState([]);
  const router = useRouter();

  const likePost = async () => {
    if (user) {
      if (isLiked) {
        await deleteDoc(doc(db, "posts", post.id, "likes", user?.uid));
      } else {
        await setDoc(doc(db, "posts", post.id, "likes", user?.uid), {
          user: user.email,
        });
      }
    } else {
      router.push("/login");
    }
  };

  const Comment = async () => {
    if (user) {
      await addDoc(collection(db, "posts", post.id, "comments"), {
        comment: input,
        timestamp: serverTimestamp(),
        name: user.email,
        userId: user.uid,
      });
      setInput("");
      setOpen(false);
      await router.push(`posts/${post.id}`)
    }
  };

  const deletePost = () => {
    deleteDoc(doc(db, "posts", post.id));
    if (post.data().image) {
      deleteObject(ref(storage, `posts/${post.id}/image`));
    }
  };

  const updatePost = async () => {
    if (updateIt) {
      await updateDoc(doc(db, "posts", post.id), {
        text: updateIt,
        changed: "Düzenlendi",
      });
      setUpdateModal(false);
      setUpdateIt("");
    } else {
      toast.error("Birşeyler yaz");
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", post.id, "comments"),
      (snapshot) => setComments(snapshot.docs)
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", post.id, "likes"),
      (snapshot) => setlikes(snapshot.docs)
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsLiked(likes.find((like) => like.id == user?.uid));
  }, [likes, user]);

  return (
    <div className="p-4 border-t mt-1 cursor-pointer">
      <div onClick={()=>router.push(`posts/${post.id}`)} className="cursor-pointer flex items-center space-x-3">
        <div
          className={`w-11 h-11 rounded-full bg-orange-600 flex items-center justify-center`}
        >
          <h3 className="font-semibold text-xl text-white">
            {post.data().name.toUpperCase().slice(0, 1)}
          </h3>
        </div>
        <h3 className="font-bold text-sm md:text-base">{post.data().name}</h3>
        <h3 className="text-slate-400 text-xs md:text-sm">
          @{post.data().name}
        </h3>
        <Moment className="text-xs md:text-sm" fromNow>
          {post?.data().timestamp?.toDate()}
        </Moment>
      </div>
      <div className="ml-14 break-words">
        <div
          className="cursor-pointer"
          onClick={() => router.push(`posts/${post.id}`)}
        >
          <span>{post.data().text}</span>
          <img className="rounded-xl mt-2" alt="" src={post.data().image} />
        </div>
        <div className="flex items-center justify-between mt-2 text-slate-500">
          <div onClick={() => user?setOpen(true):toast.error("Yorum yapmak için oturum açın!")} className="flex items-center">
            <ChatAlt2Icon className="w-8 hover:text-blue-600 hover:bg-blue-100 rounded-full p-1 cursor-pointer transition-all duration-200" />

            {comments.length}
          </div>
          <div className="flex items-center">
            {isLiked ? (
              <SolidHeartIcon
                onClick={likePost}
                className="w-8 p-1 text-red-600 transition-all duration-200 cursor-pointer animate"
              />
            ) : (
              <HeartIcon
                onClick={likePost}
                className="w-8 hover:text-red-600 hover:bg-red-100 rounded-full p-1 cursor-pointer transition-all duration-200"
              />
            )}
            {isLiked ? (
              <span className="text-red-400">{likes.length}</span>
            ) : (
              <span className="text-gray-400">{likes.length}</span>
            )}
          </div>

          {user?.uid === post.data().id && (
            <TrashIcon
              onClick={() => setOpenDeleteModal(true)}
              className="w-8 p-1 cursor-pointer  transition-all duration-200 rounded-full hover:text-gray-600 hover:bg-gray-300"
            />
          )}

          <div>
            {user?.uid === post.data().id && (
              <button
                className="font-semibold bg-yellow-300 py-1 px-2 rounded-full transition-all duration-200 hover:bg-yellow-400"
                onClick={() => setUpdateModal(true)}
              >
                Düzenle
              </button>
            )}
          </div>
        </div>
        <h1 className="italic text-xs mt-1">{post.data().changed}</h1>
      </div>

      <Modal
        isOpen={open}
        ariaHideApp={false}
        onRequestClose={() => setOpen(false)}
        className="p-4 h-80 max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 rounded-xl shadow-md"
      >
        <div
          className="cursor-pointer w-8 h-8 hover:bg-gray-200 flex items-center justify-center  rounded-full transition-all duration-200"
          onClick={() => setOpen(false)}
        >
          <XIcon className="w-6" />
        </div>
        <div className="p-2 flex items-center space-x-1 relative">
          <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300" />
          <div
            className={`w-11 h-11 rounded-full bg-orange-600 flex items-center justify-center`}
          >
            <h3 className="font-semibold text-xl text-white">
              {post.data().name.toUpperCase().slice(0, 1)}
            </h3>
          </div>
          <h4 className="font-bold lg:text-lg hover:underline">
            {post?.data()?.name}
          </h4>
          <span className="text-sm lg:text-base text-gray-00">
            @{post?.data()?.name}
          </span>
          <span className="text-sm sm:text-[15px] hover:underline"></span>
        </div>
        <p className="text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2">
          {post?.data()?.text}
        </p>

        <div className="flex  p-3 space-x-3 ">
          <div
            className={`w-14 sm:w-[52px]  h-11 rounded-full bg-orange-600 flex items-center justify-center`}
          >
            <h3 className="font-semibold text-xl text-white">
              {user?.email.toUpperCase().slice(0, 1)}
            </h3>
          </div>
          <div className=" w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="resize-none outline-none w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                rows="2"
                placeholder="Yanıtını Tweetle"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2.5">
              <button
                onClick={Comment}
                disabled={!input.trim()}
                className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
              >
                Yanıtla
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openDeleteModal}
        ariaHideApp={false}
        onRequestClose={() => setOpenDeleteModal(false)}
        className="p-5 h-40 max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 rounded-xl shadow-md"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-red-500 font-semibold">
            Gerçekten silmek istiyormusunuz?
          </h2>
          <div className="space-x-6 mt-8">
            <button
              className=" bg-blue-400 py-2 px-4 text-white font-semibold hover:bg-red-400 transition-all duration-200"
              onClick={deletePost}
            >
              EVET
            </button>
            <button
              className=" bg-blue-400 py-2 px-4 text-white font-semibold hover:bg-red-400 transition-all duration-200"
              onClick={() => setOpenDeleteModal(false)}
            >
              HAYIR
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={updateModal}
        ariaHideApp={false}
        onRequestClose={() => setUpdateModal(false)}
        className="p-5 h-80 max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 rounded-xl shadow-md"
      >
        <div
          className="cursor-pointer w-8 h-8 hover:bg-gray-200 flex items-center justify-center  rounded-full transition-all duration-200"
          onClick={() => setUpdateModal(false)}
        >
          <XIcon className="w-6" />
        </div>
        <div className="p-2 flex items-center space-x-1 relative">
          <span className="bg-gray-300" />
          <div
            className={`w-11 h-11 rounded-full bg-orange-600 flex items-center justify-center`}
          >
            <h3 className="font-semibold text-xl text-white">
              {post.data().name.toUpperCase().slice(0, 1)}
            </h3>
          </div>
          <h4 className="font-bold lg:text-lg hover:underline">
            {post?.data()?.name}
          </h4>
          <span className="text-sm lg:text-base text-gray-00">
            @{post?.data()?.name}
          </span>
        </div>
        <p className="text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2">
          {post?.data()?.text}
        </p>

        <div className="flex  p-3 space-x-3 ">
          <div className=" w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="resize-none outline-none w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                rows="2"
                placeholder="Tweet'ini Güncelle"
                value={updateIt}
                onChange={(e) => setUpdateIt(e.target.value)}
                autoFocus
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-2.5">
              <button
                onClick={updatePost}
                disabled={!updateIt.trim()}
                className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TweetPost;
