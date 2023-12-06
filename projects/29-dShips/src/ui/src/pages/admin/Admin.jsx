"use client";
import React, { useState } from "react";
import Create from "@/components/admin/Create";
import MyShips from "@/components/admin/MyShips";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("myShips");

  return (
    <div className="flex flex-col gap-6 font-medium">
      <div className="flex gap-2">
        <button
          className={
            activeSection == "myShips"
              ? "bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4"
              : "py-2 px-4 rounded-full hover:bg-coreColors-secondary hover:text-schemes-light-onSecondary transition duration-200"
          }
          onClick={() => {
            setActiveSection("myShips");
          }}
        >
          My ships
        </button>
        <button
          className={
            activeSection == "create"
              ? "bg-schemes-light-primary text-schemes-light-onPrimary hover:bg-coreColors-primary rounded-full py-2 px-4"
              : "py-2 px-4 rounded-full hover:bg-coreColors-secondary hover:text-schemes-light-onSecondary transition duration-200"
          }
          onClick={() => {
            setActiveSection("create");
          }}
        >
          Create
        </button>
      </div>
      <div>
        {activeSection == "create" && <Create />}
        {activeSection == "myShips" && <MyShips />}
      </div>
    </div>
  );
};

export default Admin;
/*

*/
