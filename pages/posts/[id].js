/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "/components/Sidebar";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import Moment from "react-moment";
import "moment/locale/tr";
import { useAuth } from "../../context/AuthContext";
import {
  TrashIcon,
  HomeIcon,
  UserIcon,
  UserAddIcon,
} from "@heroicons/react/outline";
import Link from "next/link";

const Post = ({ randomUsersResults }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);

  const deleteComment = (comment) => {
    deleteDoc(doc(db, "posts", id, "comments", comment));
  };

  useEffect(() => {
    if (id) {
      onSnapshot(doc(db, "posts", id), (snapshot) => setPost(snapshot));
    }
  }, []);

  useEffect(() => {
    if (id) {
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      );
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto max-h-screen relative">
      <main className="grid grid-cols-9 ">
        <Sidebar />
        <div className=" border-x col-span-9 sm:col-span-7 lg:col-span-5 p-2 relative">
          <div className="border-b">
            <div
              onClick={() => router.back()}
              className="max-w-fit  p-2 flex items-center space-x-2  cursor-pointer hover:text-blue-400 transition-all duration-200"
            >
              <ArrowNarrowLeftIcon className="w-8 " />
              <h2 className="font-semibold text-xl tracking-wide">Geri</h2>
            </div>
          </div>
          <div className="cursor-pointer flex items-center space-x-3 p-4">
            <div
              className={`w-11 h-11 rounded-full bg-orange-600 flex items-center justify-center`}
            >
              <h3 className="font-semibold text-xl text-white">
                {post?.data().name?.toUpperCase().slice(0, 1)}
              </h3>
            </div>
            <h3 className="font-bold text-sm md:text-base">
              {post?.data().name}
            </h3>
            <h3 className="text-slate-400 text-xs md:text-sm">
              @{post?.data().name}
            </h3>
            <Moment className="text-xs md:text-sm" fromNow>
              {post?.data().timestamp?.toDate()}
            </Moment>
          </div>
          <div className="border-b">
            <div className="ml-14 break-words px-4 ">
              <div className="cursor-pointer">
                <span>{post?.data().text}</span>
                <img
                  className="rounded-xl my-2"
                  alt=""
                  src={post?.data().image}
                />
              </div>
            </div>
          </div>
          <div className="">
            {comments.map((comment) => (
              <div className="border-b" key={comment?.id}>
                <div className="ml-10 p-4">
                  <div className="cursor-pointer flex items-center space-x-3 p-4">
                    <div
                      className={`w-11 h-11 rounded-full bg-orange-600 flex items-center justify-center`}
                    >
                      <h3 className="font-semibold text-xl text-white">
                        {comment?.data().name?.toUpperCase().slice(0, 1)}
                      </h3>
                    </div>
                    <h3 className="font-bold text-sm md:text-base">
                      {comment
                        ?.data()
                        .name.slice(0, comment?.data().name.search("@"))}
                    </h3>

                    <Moment className="text-xs md:text-sm" fromNow>
                      {comment?.data().timestamp?.toDate()}
                    </Moment>
                  </div>
                  <p className="ml-6 break-words"> {comment?.data().comment}</p>
                </div>
                {comment?.data().userId === user?.uid && (
                  <button
                    className="ml-20"
                    onClick={() => deleteComment(comment?.id)}
                  >
                    <TrashIcon className="w-6" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:inline col-span-2 p-2 space-y-4 ">
          <div className="bg-[#EFF1F1] p-3 rounded-2xl sticky top-5">
            <h1 className="font-semibold mb-6">Tanıyor Olabileceğin Kişiler</h1>
            {randomUsersResults.results.map((result) => (
              <div
                key={result.login.username}
                className="space-y-4 flex items-center px-4 py-2  cursor-pointer hover:bg-gray-200 transition duration-500 ease-out"
              >
                <img
                  className="rounded-full"
                  width="40"
                  src={result.picture.thumbnail}
                  alt=""
                />
                <div className="truncate ml-4 leading-5">
                  <h4 className="font-bold hover:underline text-[14px] truncate">
                    {result.login.username}
                  </h4>
                  <h5 className="text-[13px] text-gray-500 truncate">
                    {result.name.first + " " + result.name.last}
                  </h5>
                </div>
                <button className="ml-auto bg-black text-white rounded-full text-sm px-3.5 py-1.5 font-bold">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <div className="sm:hidden flex w-full items-center justify-between px-2 fixed bottom-0 z-10 bg-white ">
        <Link href="/">
          <div
            className={`  cursor-pointer transition-all duration-300 rounded-full flex p-3 items-center space-x-4 text-lg hover:bg-gray-100 max-w-fit `}
          >
            <HomeIcon className="w-8 " />
            <h2 className=" hidden lg:inline">
              Anasayfa
            </h2>
          </div>
        </Link>
        <Link href="/login">
          <div
            className={` cursor-pointer transition-all duration-300 rounded-full flex p-3 items-center space-x-4 text-lg hover:bg-gray-100 max-w-fit `}
          >
            <UserIcon className="w-8 " />
            <h2 className="hidden lg:inline">
              Oturum Aç
            </h2>
          </div>
        </Link>
        <Link href="/register">
          <div
            className={`  cursor-pointer transition-all duration-300 rounded-full flex p-3 items-center space-x-4 text-lg hover:bg-gray-100 max-w-fit `}
          >
            <UserAddIcon className="w-8 " />
            <h2 className="hidden lg:inline">
              Kayıt Ol
            </h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Post;

export async function getServerSideProps() {
  const randomUsersResults = await fetch(
    "https://randomuser.me/api/?results=10&inc=name,login,picture"
  ).then((res) => res.json());

  return {
    props: {
      randomUsersResults,
    },
  };
}
