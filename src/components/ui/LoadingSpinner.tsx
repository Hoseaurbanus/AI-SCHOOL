interface Props {
  size?: number
  color?: string
}

export default function LoadingSpinner({
  size = 24,
  color = "#3B82F6",
}: Props) {
  return (
    <div
      className="border-2 border-t-transparent rounded-full animate-spin"
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderTopColor: "transparent",
      }}
    />
  )
}
