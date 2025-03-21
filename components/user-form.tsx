"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, BadgeIcon as IdCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/image-upload";

interface UserFormProps {
  userId?: string;
}

// Update the UserData interface to match the new data structure
interface UserData {
  mssv: string;
  hoten: string;
  lop: string;
  hinhanh: string;
}

// Update the initial state
export function UserForm({ userId }: UserFormProps = {}) {
  const [formData, setFormData] = useState<UserData>({
    mssv: "",
    hoten: "",
    lop: "",
    hinhanh: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!userId;

  // Update the useEffect to handle the new data structure when fetching a user
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          setFetchLoading(true);
          const response = await fetch(
            `https://67dd033ce00db03c4069c5ee.mockapi.io/api/v1/users/${userId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }

          const data = await response.json();
          setFormData({
            mssv: data.mssv,
            hoten: data.hoten,
            lop: data.lop,
            hinhanh: data.hinhanh,
          });
        } catch (err) {
          toast({
            title: "Error",
            description: "Failed to load user data. Please try again.",
            variant: "destructive",
          });
          console.error(err);
        } finally {
          setFetchLoading(false);
        }
      };

      fetchUser();
    }
  }, [userId, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      hinhanh: url,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // In a real application, you would convert the blob URL to a file
      // and upload it to your server or a storage service
      // For this demo, we'll just use the URL directly

      const url = isEditing
        ? `https://67dd033ce00db03c4069c5ee.mockapi.io/api/v1/users/${userId}`
        : "https://67dd033ce00db03c4069c5ee.mockapi.io/api/v1/users";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} user`);
      }

      toast({
        title: isEditing ? "User updated" : "User created",
        description: isEditing
          ? "The user has been successfully updated."
          : "The user has been successfully created.",
      });

      router.push("/");
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${
          isEditing ? "update" : "create"
        } user. Please try again.`,
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IdCard className="h-5 w-5 text-primary" />
          <CardTitle>Student Information</CardTitle>
        </div>
        <CardDescription>
          {isEditing
            ? "Edit the student information below"
            : "Enter the student information below"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Update the form fields to match the new data structure */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mssv" className="font-medium">
              Student Code
            </Label>
            <Input
              id="mssv"
              name="mssv"
              value={formData.mssv}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hoten">Full Name</Label>
            <Input
              id="hoten"
              name="hoten"
              value={formData.hoten}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lop">Class</Label>
            <Input
              id="lop"
              name="lop"
              value={formData.lop}
              onChange={handleChange}
              placeholder="Enter class"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Student Image</Label>
            <ImageUpload
              value={formData.hinhanh}
              onChange={handleImageChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Note: In this demo, images are stored temporarily. In a production
              app, they would be uploaded to a server.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? "Update" : "Create"} Student
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
