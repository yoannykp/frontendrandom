const BackgroundCover = () => {
  return (
    <>
      <div className="fixed w-[100vw] h-[100vh]">
        <div
          className="bg-cover bg-center absolute inset-0 w-full h-full bg-no-repeat"
          style={{ background: "url(/images/404.jpeg)" }}
        ></div>
      </div>
      <div className="bg-gradient-to-l w-full h-full absolute inset-0 from-gray-700/20 via-gray-900/20 to-black/20"></div>
    </>
  )
}

export default BackgroundCover
