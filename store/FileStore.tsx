// import { create } from 'zustand'
// import { toast } from 'react-hot-toast'

// interface FileUpload {
//     id: string
//     fileName: string
//     fileType: 'DPF' | 'EGR' | 'OTHER'
//     status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
//     uploadedAt: Date
//     userId: string
// }

// interface FileStore {
//     files: FileUpload[]
//     isLoading: boolean
//     error: string | null
//     uploadFile: (file: File, type: FileUpload['fileType'], userId: string) => Promise<void>
//     fetchUserFiles: (userId: string) => Promise<void>
// }

// export const useFileStore = create<FileStore>((set, get) => ({
//     files: [],
//     isLoading: false,
//     error: null,

//     uploadFile: async (file: File, type: FileUpload['fileType'], userId: string) => {
//         set({ isLoading: true, error: null })
//         try {
//             const formData = new FormData()
//             formData.append('file', file)
//             formData.append('type', type)
//             formData.append('userId', userId)

//             const response = await fetch('/api/files/upload', {
//                 method: 'POST',
//                 body: formData,
//             })

//             if (!response.ok) throw new Error('Failed to upload file')

//             const newFile = await response.json()
//             set(state => ({ files: [...state.files, newFile] }))
//             toast.success('File uploaded successfully')
//         } catch (error) {
//             set({ error: 'Failed to upload file' })
//             toast.error('Failed to upload file')
//         } finally {
//             set({ isLoading: false })
//         }
//     },

//     fetchUserFiles: async (userId: string) => {
//         set({ isLoading: true, error: null })
//         try {
//             const response = await fetch(`/api/files/${userId}`)
//             if (!response.ok) throw new Error('Failed to fetch files')

//             const files = await response.json()
//             set({ files })
//         } catch (error) {
//             set({ error: 'Failed to fetch files' })
//             toast.error('Failed to fetch files')
//         } finally {
//             set({ isLoading: false })
//         }
//     }
// }))