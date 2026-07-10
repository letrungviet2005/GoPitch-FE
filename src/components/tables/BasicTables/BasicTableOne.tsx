import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import {
  getAdminUsers,
  setAdminUserActive,
  type AdminUser,
} from "../../../services/adminService";

export default function UserTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const size = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAdminUsers({
          page: page - 1,
          size,
          sort: "id,asc",
        });
        setUsers(data.result || []);
        setTotalPages(data.meta?.pages || 1);
      } catch (err) {
        console.error("Cannot load users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const toggleActive = async (user: AdminUser) => {
    try {
      const updated = await setAdminUserActive(user.id, !user.active);
      setUsers((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (err) {
      console.error("Cannot update user status:", err);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500">
                Ten
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500">
                Vai tro
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500">
                Streak
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500">
                Diem
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start text-gray-500">
                Trang thai
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {loading ? (
              <TableRow>
                <td className="px-5 py-8 text-center text-gray-500" colSpan={6}>
                  Dang tai user...
                </td>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-300">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-300">
                    {user.role?.name || "USER"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-300">
                    {user.streakCount || 0}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-300">
                    {user.point}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <button type="button" onClick={() => toggleActive(user)}>
                      <Badge color={user.active ? "success" : "error"} size="sm">
                        {user.active ? "Hoat dong" : "Vo hieu"}
                      </Badge>
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center gap-4 py-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Truoc
        </button>
        <span className="font-medium">
          Trang {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Tiep
        </button>
      </div>
    </div>
  );
}
