"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, X, Upload } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock upload function that simulates uploading and returns a URL
  const mockUpload = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Create a temporary URL for the file
        const url = URL.createObjectURL(file)
        resolve(url)
      }, 1500)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Check file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      setError("File size must be less than 4MB")
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // In a real app, you would upload to a server here
      const imageUrl = await mockUpload(file)

      onChange(imageUrl)
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    // Check file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      setError("File size must be less than 4MB")
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // In a real app, you would upload to a server here
      const imageUrl = await mockUpload(file)

      onChange(imageUrl)
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const onRemove = () => {
    onChange("")
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4 w-full">
      {value ? (
        <div className="relative h-40 w-40">
          <img src={value || "/placeholder.svg"} alt="Upload" className="h-full w-full rounded-md object-cover" />
          <Button
            onClick={onRemove}
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : isUploading ? (
        <div className="flex items-center justify-center w-full p-6 border-2 border-dashed border-primary/20 rounded-md">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-primary/20 rounded-md cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <Upload className="h-10 w-10 text-primary/60 mb-2" />
          <p className="text-sm font-medium">Drag & drop an image here, or click to select</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF up to 4MB</p>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
      )}
    </div>
  )
}

