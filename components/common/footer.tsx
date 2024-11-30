const Footer = () => {
  return (
    <div className="font-inter text-[12px]/[12px] font-normal text-off-white flex gap-1 md:gap-0 flex-col md:flex-row w-full justify-center items-center">
      <span>© {new Date().getFullYear()} Alienzone All rights reserved.</span>
      <span>
        &nbsp; Reach out to us at &nbsp;
        <span className="border-b border-off-white">team@alienzone.io</span>
      </span>
    </div>
  )
}

export default Footer
