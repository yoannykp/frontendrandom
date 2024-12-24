"use client"

const page = () => {
  return (
    <>
      <div className=" flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden lg:min-h-[calc(100vh-40px)]">
        <div className="absolute inset-0 bg-[url('/images/characters/character-1-mobile.png')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/pages/bg.jpg')] "></div>

        <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-28 relative">
          <div className="glass-effect h-full">asd</div>
        </div>
      </div>

      {/* Background Gradients */}
      <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(69.65% 69.65% at 43.52% 23.05%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.54) 100%)",
        }}
      ></div>
      <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(48.12% 75.2% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.81) 100%)",
        }}
      ></div>
    </>
  )
}

export default page
