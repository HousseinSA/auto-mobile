import Image from "next/image"

export default function PageBackground() {
  return (
    <>
      <div className="fixed inset-0 w-full h-full -z-20">
        <Image
          src="/images/toyota-car.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.08] select-none pointer-events-none transition-opacity duration-300"
          quality={90}
          sizes="100vw"
        />
      </div>
      <div
        className="fixed inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/5 -z-10"
        aria-hidden="true"
      />
    </>
  )
}
