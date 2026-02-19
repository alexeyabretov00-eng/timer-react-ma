import React from "react";
import styled from "styled-components";
import { Block } from "../Block";
import { ActionButton } from "../ActionButton";

export const AddButton: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (<AddButtonStyled onClick={onClick}>
    <Block>
      <ActionButton>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8.5" width="3" height="20" fill="#9E9E9E" />
          <rect y="11.5" width="3" height="20" transform="rotate(-90 0 11.5)" fill="#9E9E9E" />
        </svg>
      </ActionButton>
    </Block>
  </AddButtonStyled>)
}

const AddButtonStyled = styled.div`
  cursor: pointer;
`;
