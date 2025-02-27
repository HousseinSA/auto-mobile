import Image from "next/image"

export function ToyotaLogo() {
  return (
    <div className="flex justify-center py-2  flex-shrink-0">
      <div className="relative w-32 h-20 sm:w-32 sm:h-28 md:w-40 md:h-32 lg:w-56 lg:h-32">
        <Image
          src="/images/toyota-logo.png"
          alt="Toyota Logo"
          layout="fill"
          priority
          className="object-contain"
        />
      </div>
    </div>
  )
}
