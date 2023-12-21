import React from "react";

function Textera({ label, value }) {
  return (
    <div className="mt-4">
      <label className="text-[20px] font-semibold pb-2" htmlFor="">
        {label}
      </label>
      <textarea
        rows={4}
        disabled={true}
        className="mt-2 px-4 text-[18px] bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
        defaultValue={value}
      />
    </div>
  );
}

export default Textera;
