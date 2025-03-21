import { UserForm } from "@/components/user-form"

export default function EditUserPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Student</h1>
      <UserForm userId={params.id} />
    </div>
  )
}

