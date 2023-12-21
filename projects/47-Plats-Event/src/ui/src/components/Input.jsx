import React from "react";

function Input({ label, value }) {
  return (
    <div className="mt-4">
      <label className="text-[20px] font-semibold pb-2" htmlFor="">
        {label}
      </label>
      <input
        disabled={true}
        className=" mt-2 px-4 h-[50px] text-[18px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
        defaultValue={value}
      />
    </div>
  );
}

export default Input;
