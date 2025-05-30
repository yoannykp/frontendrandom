import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      )
    }

    const imageRes = await fetch(url)

    if (!imageRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: imageRes.status }
      )
    }

    const buffer = await imageRes.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": imageRes.headers.get("content-type") || "image/png",
      },
    })
  } catch (error) {
    console.error("Image proxy error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
