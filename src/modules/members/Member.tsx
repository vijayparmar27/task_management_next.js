import React from "react";
import MembersList from "./components/MembersList";
import InviteForm from "./components/InviteForm";

const Member = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Current Members</h2>
            <MembersList />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Invite New Member</h2>
            <InviteForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Member;
