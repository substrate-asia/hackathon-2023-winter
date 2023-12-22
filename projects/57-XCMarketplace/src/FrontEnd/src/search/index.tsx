
"use client"
import React from "react";
import { Input, Button } from "..";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const onChange = ({ target }:{ target: any }) => setSearchTerm(target.value);
 
  return (
    <div className="relative flex w-2/3 items-center">
      <Input
        type="search"
        placeholder="search..."
        className="!border !border-gray-300 p-2 w-full bg-white text-gray-900 h-16 rounded-md shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
        labelProps={{
          className: "hidden",
        }}
        containerProps={{ className: "min-w-[100px]" }}
        crossOrigin={undefined}
        value={searchTerm}
        onChange={onChange}
      />
      <Button
        variant="text"
        size="sm"
        disabled={false}
        className={`!absolute drop-shadow-none right-3 rounded bg-purple-300 p-2 ${searchTerm ? "bg-purple-300" : "bg-gray-200"}`} placeholder={undefined}>
        Search
      </Button>
    </div>
  );
}