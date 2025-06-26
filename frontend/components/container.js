import { ReactNode } from "react"

export default function Container({ children, className = "" }) {
  return <div className={`container mx-auto px-4 ${className}`}>{children}</div>
}
