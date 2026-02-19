import React from "react"
import { ActionButton } from "../ActionButton"

export const RemoveButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (<ActionButton onClick={onClick}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2L18 18M18 2L2 18" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </ActionButton>
  )
}
