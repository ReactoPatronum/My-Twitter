import React, { useState } from "react";
import Image from "next/image";
import loginImage from "/public/twLogo.jpg";
import googleImg from "/public/icons8-google-240.png";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import {  doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import uuid from 'react-uuid'


const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const { registerUser, signUpWithGoogle } = useAuth();

  const userList = async () => {
    await setDoc(doc(db, "users",email), {
      mail:email,
      name:email.slice(0,email.search("@")),
      id: uuid(),
      timestamp: serverTimestamp(),
    });
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    if (password === passwordCheck) {
      try {
        //localStorage.setItem("pss",password)
        await registerUser(email, password);
        userList()
        setPassword("");
        setPasswordCheck("");
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error("Şifreler Uyuşmuyor");
    }
  };

  return (
    <main className="grid grid-cols-6 h-screen ">
      <div className="hidden md:block md:col-span-2 lg:col-span-3 relative ">
        <Image alt="" objectFit="cover" layout="fill" src={loginImage} />
      </div>
      <div className="col-span-6 md:col-span-4 lg:col-span-3  ">
        <div className=" flex flex-col items-center justify-center w-full h-screen">
          <div className=" h-screen  mt-20 m-auto">
            <div className="">
              <h2 className="text-2xl lg:text-4xl">Kaydol</h2>
              <h2 className="mt-2 lg:text-xl">
                Ücretsizdir ve her zaman ücretsiz kalacaktır.
              </h2>
            </div>
            <div className="space-y-4 mt-4 ">
              <form
                className="flex flex-col space-y-4"
                onSubmit={handleRegister}
              >
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full max-w-[400px] p-3 outline-none ring-1 ring-orange-200"
                  placeholder="E-Mail"
                  type="email"
                />
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full max-w-[400px] p-3 outline-none ring-1 ring-orange-200"
                  placeholder="Şifre"
                  type="password"
                />
                <input
                  required
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  className="w-full max-w-[400px] p-3 outline-none ring-1 ring-orange-200"
                  placeholder="Şifrenizi Tekrar Girin"
                  type="password"
                />

                <button
                  type="submit"
                  className="bg-blue-400 max-w-[400px] p-4 text-white font-semibold text-lg hover:scale-105 hover:bg-blue-500 transition-all duration-200 rounded-md"
                >
                  Kayıt Ol
                </button>
              </form>
              <p className="text-center font-semibold">ya da</p>
              <div className="flex items-center bg-red-400 text-white justify-center rounded-md transition-all duration-200 hover:bg-red-500 cursor-pointer ">
                <Image alt="" src={googleImg} height={60} width={60} />
                <button
                  onClick={signUpWithGoogle}
                  className="ml-4 text-white font-semibold text-lg "
                >
                  Google ile Oturum Aç
                </button>
              </div>
              <h2 className="text-center font-semibold">
                Zaten bir hesabınız mı var?
                <span
                  onClick={() => router.push("/login")}
                  className=" ml-6 text-purple-500 cursor-pointer hover:underline"
                >
                  Oturum Aç
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
