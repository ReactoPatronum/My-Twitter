import React from "react";
import twitter from "/public/TWlogo.webp";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  UserIcon,
  HomeIcon,
  DotsHorizontalIcon,
  PencilIcon,
  UserAddIcon,
} from "@heroicons/react/outline";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logOutUser } = useAuth();
  const router=useRouter()
  
  return (
    <div className="sm:flex flex-col justify-between items-center h-[97vh] hidden  sm:col-span-2 p-2 sticky top-5">
      <div className="space-y-3 ">
        <Image
          className="cursor-pointer"
          objectFit="contain"
          height={35}
          width={35}
          src={twitter}
          alt="logo"
        />

        <div
          onClick={() => router.push("/")}
          className="group cursor-pointer transition-all duration-300 rounded-full flex p-3 items-center space-x-4 text-lg hover:bg-gray-100 max-w-fit"
        >
          <HomeIcon className="w-8 " />
          <h2 className="group-hover:text-[#00ACED] hidden lg:inline">
            Anasayfa
          </h2>
        </div>
        {user ? (
          <div
            onClick={logOutUser}
            className="group cursor-pointer transition-all duration-300 rounded-full flex p-3 items-center space-x-4 text-lg hover:bg-gray-100 max-w-fit"
          >
            <UserIcon className="w-8 text-green-400" />
            <h2 className="group-hover:text-[#00ACED] hidden lg:inline">
              Oturumu Kapat
            </h2>
          </div>
        ) : (
          <div
            onClick={() => router.push("/login")}
            className="group cursor-pointer transition-all duration-300 rounded-full flex p-3 items-center space-x-4 text-lg hover:bg-gray-100 max-w-fit"
          >
            <UserIcon className="w-8 text-red-500" />
            <h2 className="group-hover:text-[#00ACED] hidden lg:inline">
              Oturum Aç
            </h2>
          </div>
        )}
        <div
          onClick={() => router.push("/register")}
          className="group cursor-pointer transition-all duration-300 rounded-full flex p-3 items-center space-x-4 text-lg hover:bg-gray-100 max-w-fit"
        >
          <UserAddIcon className="w-8 " />
          <h2 className="group-hover:text-[#00ACED] hidden lg:inline">
            Kayıt Ol
          </h2>
        </div>
        <div>
          <button className="hidden lg:inline hover:brightness-90 transition-all duration-300 ease-out rounded-full bg-[#1C9AED] text-white p-4 w-56 font-bold ">
            Tweetle
          </button>

          <div className="hover:brightness-90 transition-all duration-300 ease-out bg-[#00ACED] max-w-fit rounded-full p-2 cursor-pointer lg:hidden ml-1 ">
            <PencilIcon className="w-6  text-white" />
          </div>
        </div>
      </div>
      {user && (
        <div className="hidden transition-all duration-500 ease-out hover:bg-gray-100 rounded-full p-2 cursor-pointer mt-1 lg:flex items-center justify-between w-60">
          <div className="flex space-x-2 ">
            <Image
              className="rounded-full"
              objectFit="contain"
              height={30}
              width={30}
              src={twitter}
              alt=""
            />
            <div className="flex flex-col items-center">
              <p className="font-semibold">
                {user && user.email.slice(0, user.email.search("@"))}
              </p>
              <span className="text-gray-500">
                @{user && user.email.slice(0, user.email.search("@"))}
              </span>
            </div>
          </div>

          <div className="">
            <DotsHorizontalIcon className="w-6 " />
          </div>
        </div>
      )}
      <div className="lg:hidden">
        <Image
          className="rounded-full "
          objectFit="contain"
          height={30}
          width={30}
          src={twitter}
          alt=""
        />
      </div>
    </div>
  );
};

export default Sidebar;
