export default function ManageUsers() {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "User",
      status: "Active",
    },
    {
      id: 2,
      name: "Admin Khan",
      email: "admin@care.io",
      role: "Admin",
      status: "Active",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold">Manage Users</h2>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-sm font-bold text-slate-600">Name</th>
            <th className="px-6 py-4 text-sm font-bold text-slate-600">
              Email
            </th>
            <th className="px-6 py-4 text-sm font-bold text-slate-600">Role</th>
            <th className="px-6 py-4 text-sm font-bold text-slate-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium">{user.name}</td>
              <td className="px-6 py-4 text-slate-600">{user.email}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-red-500 hover:underline font-bold text-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
