import toast from 'react-hot-toast'
const toastMessage = (message: string, state: string) => {
    const ToastMessage = state === 'success' ? toast.success(message) : toast.error(message)

    return ToastMessage

}

export default toastMessage