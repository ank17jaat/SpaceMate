import React from "react";
import AddOfficeSpaceForm from "@/components/AddOfficeSpaceForm";

export default function AddOfficeSpacePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Add Office Space</h1>
      <AddOfficeSpaceForm />
    </div>
  );
}
