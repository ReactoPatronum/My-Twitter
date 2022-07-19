import React from "react";
import { SearchIcon } from "@heroicons/react/outline";
import { TwitterTimelineEmbed } from "react-twitter-embed";


const RightBar = () => {
  
  return (
    <div className="hidden lg:inline col-span-2 p-2 space-y-4 ">
      <div className="flex bg-[#EFF1F1]  rounded-full p-2 space-x-1 focus-within:border-2 border-[#00ACED]">
        <SearchIcon className="w-6 back text-[#00ACED] cursor-pointer" />
        <input
          
          className="placeholder:pl-[10px] flex-1 bg-transparent outline-none border-0 border-none ring-0"
          placeholder="Birşeyler Ara.."
          type="text"
        />
      </div>
      <div className="bg-[#EFF1F1] p-3 rounded-2xl sticky top-5">
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="reactjs"
          options={{ height: 900 }}
         
        />
      </div>
    </div>
  );
};

export default RightBar;
