"use client";

import { selectUserData } from "@/store/user/user.store";
import { User } from "lucide-react";
import { useSelector } from "react-redux";

export default function MembersList() {
  const { userData } = useSelector(selectUserData);

  return (
    <ul className="space-y-4">
      {userData?.data.members.map((member) => (
        <li
          key={member._id}
          className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded-full">
            <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <h2 className="font-semibold">{member.name}</h2>
            <h6>
              <strong>{member.role}</strong>
            </h6>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {member.email}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
