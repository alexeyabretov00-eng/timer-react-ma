import React from "react"
import { ActionButton } from "../ActionButton"

export const PauseButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (<ActionButton onClick={onClick}>
    <svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" width="3" height="20" fill="white"/>
      <rect width="3" height="20" fill="white"/>
    </svg>
  </ActionButton>
  )
}
