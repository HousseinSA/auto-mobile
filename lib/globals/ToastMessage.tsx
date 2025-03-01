import toast from "react-hot-toast"
type States = "success" | "error"
const toastMessage = (state: States, message: string) => {
  const ToastMessage =
    state === "success" ? toast.success(message) : toast.error(message)

  return ToastMessage
}

export default toastMessage
