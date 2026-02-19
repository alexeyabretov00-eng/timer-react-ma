import React from "react"
import { ActionButton } from "../ActionButton"

export const StartButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (<ActionButton onClick={onClick}>
    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 20V0L17 10L0 20Z" fill="#9E9E9E" />
    </svg>
  </ActionButton>
  )
}
