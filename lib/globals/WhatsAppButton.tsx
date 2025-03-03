"use client"
import { useSession } from "next-auth/react"
import { FaWhatsapp } from "react-icons/fa"

const WhatsAppButton = () => {
  const phoneNumber = "30607010"
  const whatsappUrl = `https://wa.me/${phoneNumber}`
  const { data: session } = useSession()
  if (session?.user?.name === "admin") {
    return null
  }
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50 cursor-pointer md:bottom-8 md:right-8"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp className="text-2xl md:text-3xl" />
    </a>
  )
}

export default WhatsAppButton
