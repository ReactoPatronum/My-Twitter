import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import TweetPost from "./TweetPost";
import Tweetarea from "/components/Tweetarea";
import { motion, AnimatePresence } from "framer-motion";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"),orderBy("timestamp","desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
    return () => unsubscribe();
  }, []);
  return (
    <div className=" border-x col-span-9 sm:col-span-7 lg:col-span-5 p-2 relative">
      <h2 className="font-semibold text-lg tracking-wide">Anasayfa</h2>
      <Tweetarea />
      <AnimatePresence>
      {posts.map((post) => (
        <motion.div
        initial={{ opacity: 0 ,y:-10}}
        animate={{ opacity: 1 ,y:0}}
        exit={{opacity:0 , y:-100}}
        transition={{duration:0.50}}
        key={post.id}>
          <TweetPost post={post} />
        </motion.div>
      ))}
      </AnimatePresence>
    </div>
  );
};

export default Feed;
