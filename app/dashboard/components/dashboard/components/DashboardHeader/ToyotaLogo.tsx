import Image from "next/image"

export function ToyotaLogo() {
  return (
    <div className="flex py-2 px-4">
      <div className="relative w-48 h-24 sm:w-56 sm:h-28">
        <Image
          src="/images/toyota-logo.png"
          alt="Toyota Logo"
          fill
          priority
          className="object-contain"
        />
      </div>
    </div>
  )
}