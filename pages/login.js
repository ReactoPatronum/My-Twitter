import React, { useState } from "react";
import Image from "next/image";
import loginImage from "/public/twLogo.jpg";
import googleImg from "/public/icons8-google-240.png";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Modal from "react-modal";
import { XIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { signInUser, forgotPassword, signUpWithGoogle, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [forgotEmail,setForgotEmail]=useState("")

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInUser(email, password);
      setPassword("");
    } catch (err) {
      console.log("err", err);
    }
  };

  const forgotPasswordHandler = async () => {
    
     if(forgotEmail){
      try{
        await forgotPassword(email);
      }catch(err){
        toast.error(err.message)
      }
     }else{
      toast.error("Email adresi girin!")
     }
      
    
  };

  const router = useRouter();
  console.log(user);
  return (
    <main className="grid grid-cols-6 h-screen ">
      <div className="hidden md:block md:col-span-2 lg:col-span-3 relative ">
        <Image alt="" objectFit="cover" layout="fill" src={loginImage} />
      </div>
      <div className="col-span-6 md:col-span-4 lg:col-span-3  ">
        <div className=" flex flex-col items-center justify-center w-full h-screen">
          <div className=" h-screen  mt-20 m-auto">
            <div className="">
              <h2 className="text-2xl lg:text-4xl">Oturum Aç</h2>
              <h2 className="mt-2 lg:text-xl">
                Hoşgeldiniz, lütfen hesabınıza giriş yapın
              </h2>
            </div>
            <div className="space-y-4 mt-4 flex flex-col">
              <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
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
                <button
                  type="submit"
                  className="bg-blue-400 max-w-[400px] p-4 text-white font-semibold text-lg hover:scale-105 hover:bg-blue-500 transition-all duration-200 rounded-md"
                >
                  Giriş Yap
                </button>
              </form>
              <button
                onClick={()=>setOpen(true)}
                className="mt-4 text-blue-400 cursor-pointer max-w-fit hover:underline"
              >
                Şifrenizi mi Unuttunuz?
              </button>
              <span className="text-center font-semibold">ya da</span>
              <div className="flex items-center bg-red-400 text-white justify-center rounded-md transition-all duration-200 hover:bg-red-500 cursor-pointer">
                <Image alt="" src={googleImg} height={60} width={60} />
                <button
                  onClick={signUpWithGoogle}
                  className="ml-4 font-semibold text-lg"
                >
                  Google ile Oturum Aç
                </button>
              </div>
              <h2 className="text-center font-semibold">
                Hesabınız Yok Mu?
                <span
                  onClick={() => router.push("/register")}
                  className=" ml-6 text-purple-500 cursor-pointer  hover:underline"
                >
                  Kayıt Ol
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={open}
        ariaHideApp={false}
        onRequestClose={() => setOpen(false)}
        className="p-4 h-96 max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 rounded-xl shadow-md"
      >
        <div
          className="cursor-pointer w-8 h-8 hover:bg-gray-200 flex items-center justify-center  rounded-full transition-all duration-200"
          onClick={() => setOpen(false)}
        >
          <XIcon className="w-6" />
        </div>
        <form className="p-5 space-y-5">
          <h1 className="text-2xl">Parolamı Unuttum</h1>
          <h2 className="">
            Parolanızı mı unuttunuz? Lütfen e-mail adresinizi girin. E-postanıza
            yeni bir şifre oluşturmak için bağlantı yollanacaktır.
          </h2>
          <input
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full max-w-[400px] p-3 outline-none ring-1 ring-orange-200"
                  placeholder="E-Mail Adresiniz"
                  type="email"
                />
                <button className="bg-blue-500 text-white p-2 rounded-md font-semibold" onClick={forgotPasswordHandler}> Parolayı Sıfırla</button>
        </form>
      </Modal>
    </main>
  );
};

export default Login;
