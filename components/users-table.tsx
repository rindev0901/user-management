"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Update the User interface to match the new data structure
interface User {
  id: string
  mssv: string
  hoten: string
  lop: string
  hinhanh: string
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://67dcde67e00db03c40692a8a.mockapi.io/api/v1/users")

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError("Failed to load users. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id)
      const response = await fetch(`https://67dcde67e00db03c40692a8a.mockapi.io/api/v1/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      setUsers(users.filter((user) => user.id !== id))
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
        {error}
        <Button variant="outline" className="mt-2" onClick={fetchUsers}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        {/* Update the TableHeader to match the new fields */}
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Class</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              // In the TableRow mapping, update the displayed fields
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.hinhanh} alt={user.hoten} />
                    <AvatarFallback>{user.hoten ? user.hoten.substring(0, 2).toUpperCase() : "UN"}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.hoten}</span>
                </TableCell>
                <TableCell>{user.mssv}</TableCell>
                <TableCell>{user.lop}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/edit-user/${user.id}`}>
                      <Button variant="outline" size="icon">
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                      disabled={deleting === user.id}
                    >
                      {deleting === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

