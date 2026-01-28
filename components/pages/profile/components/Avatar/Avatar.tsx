import Image from "next/image"

interface AvatarProps {
  url: string
  altText: string
  size: number
}

export const Avatar = ({ url, altText, size }: AvatarProps) => {
  return (
    <Image
      src={url}
      alt={altText}
      width={size}
      height={size}
      className="h-full"
    />
  )
}
