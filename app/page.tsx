import { UsersTable } from "@/components/users-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Nhóm 14, Sáng thứ 6</h1>
          <ul>
            <li>Nguyễn Huỳnh Đức - DH52107825</li>
            <li>Nguyễn Hồ Minh Hiển - DH52105753</li>
            <li>Trần Đức Huy - DH52106696</li>
            <li>Nguyễn Đoàn Minh Hùng - DH52103588</li>
            <li>Ngô Tấn Hảo - DH52103264</li>
          </ul>
        </div>
        <h1 className="text-3xl font-bold">Student Management</h1>
        <Link href="/add-user">
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Student
          </Button>
        </Link>
      </div>
      <UsersTable />
    </div>
  )
}

