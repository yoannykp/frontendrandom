import { Suspense } from "react"

import { Loader } from "@/components/common/loader"
import Home from "@/components/pages/home/index"

export default function HomePage() {
  return (
    <Loader>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            Loading...
          </div>
        }
      >
        <Home />
      </Suspense>
    </Loader>
  )
}
