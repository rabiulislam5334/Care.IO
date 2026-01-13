"use client";
import { useEffect, useState } from "react";
import { Loader2, Trash2, UserCog } from "lucide-react";
import Swal from "sweetalert2";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // রোল আপডেট করার ফাংশন
  const handleRoleChange = async (id, newRole) => {
    const res = await fetch(`/api/admin/users`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });

    if (res.ok) {
      Swal.fire({
        title: "Updated!",
        text: `User role changed to ${newRole}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchUsers();
    }
  };

  // ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
        Swal.fire("Deleted!", "User removed.", "success");
        fetchUsers();
      }
    });
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800">Manage Users</h2>
        <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-bold">
          Total: {users.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-wider">
                User Info
              </th>
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-wider">
                Current Role
              </th>
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-wider">
                Change Role
              </th>
              <th className="px-8 py-5 text-xs font-black uppercase text-slate-400 tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-slate-50/50 transition-all"
              >
                <td className="px-8 py-5">
                  <p className="font-bold text-slate-800">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      user.role === "admin"
                        ? "bg-rose-50 text-rose-600"
                        : user.role === "caretaker"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="bg-slate-100 text-slate-600 text-xs font-bold py-2 px-3 rounded-xl outline-none border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="caretaker">Caretaker</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-8 py-5 text-right">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
