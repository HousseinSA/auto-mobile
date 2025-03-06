import Image from "next/image"

export default function PageBackground() {
  return (
    <>
      <div className="fixed inset-0 w-full h-full -z-20">
        <Image
          src="/images/Car-tunning.jpeg"
          alt="background image"
          fill
          priority
          className="object-cover animate-kenburns opacity-20"
          quality={100}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30" />
      </div>
      <div
        className="fixed inset-0 backdrop-blur-[1px] bg-gradient-to-b from-white/10 via-transparent to-black/20 -z-10"
        aria-hidden="true"
      />
    </>
  )
}
