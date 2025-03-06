import Image from "next/image"

export default function DashboardBackground() {
  return (
    <>
      <div className="fixed inset-0 w-full h-full -z-20">
        <Image
          src="/images/Car-tunning.jpeg"
          alt="dashboard background"
          fill
          priority
          className="object-cover opacity-[0.03] select-none pointer-events-none"
          quality={75}
          sizes="100vw"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/40"
          aria-hidden="true"
        />
      </div>
      <div 
        className="fixed inset-0 backdrop-blur-[1px] bg-white/60 -z-10"
        aria-hidden="true"
      />
    </>
  )
}