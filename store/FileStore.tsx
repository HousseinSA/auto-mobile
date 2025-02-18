import { create } from "zustand"
import { toast } from "react-hot-toast"

interface FileUpload {
  fileName: string
  fileType: string
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
  uploadedAt: Date
  userName: string
}

interface FileStore {
  files: FileUpload[]
  loading: boolean
  error: string
  setError: (error: string) => void
  setLoading: (loading: boolean) => void
  uploadFile: (file: File, username: string) => Promise<boolean>
  fetchUserFiles: (username: string) => Promise<void>
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  loading: false,
  error: "",
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  uploadFile: async (file: File, username: string) => {
    set({ loading: true, error: "" })
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userName", username)

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        set({ error: data.error })
        toast.error(data.error)
        return false
      }

      set((state) => ({
        files: [...state.files, data],
      }))
      toast.success("File uploaded successfully")
      return true
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload file"
      set({ error: message })
      toast.error(message)
      return false
    } finally {
      set({ loading: false })
    }
  },

  fetchUserFiles: async (username: string) => {
    set({ loading: true, error: "" })
    try {
      const response = await fetch(`/api/files/${username}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      set({ files: data.files })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch files"
      set({ error: message })
      toast.error(message)
    } finally {
      set({ loading: false })
    }
  },
}))
