import styled from "styled-components";

export const StyledEmployee = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3rem;
  margin: 3rem;
`;

export const Title = styled.span`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 2em;
`;

export const Button = styled.button`
  border: 0;
  outline: none;
  border-radius: 2rem;
  padding: 1.5rem 0;
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  background: var(--color-blue-700);
  color: #fff;
  cursor: pointer;
  transition: all 0.5s ease;
  width: 100%;
  margin: 8px 0;
  &:hover,
  &:focus {
    background: var(--color-indigo-700);
  }
`;
