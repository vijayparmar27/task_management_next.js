import { User } from "lucide-react";

const members = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

export default function MembersList() {
  return (
    <ul className="space-y-4">
      {members.map((member) => (
        <li
          key={member.id}
          className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
        >
          <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded-full">
            <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {member.email}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
