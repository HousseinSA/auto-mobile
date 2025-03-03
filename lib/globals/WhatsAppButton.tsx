"use client"
import { useSession } from "next-auth/react"
import { FaWhatsapp } from "react-icons/fa"

const WhatsAppButton = () => {
  const phoneNumber = "22248817553"
  const whatsappUrl = `https://wa.me/${phoneNumber}`
  const { data: session } = useSession()

  if (session?.user?.name === "admin") {
    return null
  }

  return (
    <div className="whatsapp-button">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp className="text-2xl md:text-3xl" />
      </a>
    </div>
  )
}

export default WhatsAppButton
