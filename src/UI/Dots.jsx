import styled from "styled-components";

const StyledDot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
`;

const Dot = styled.span`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  background-color: ${(props) => {
    if (props.color === "blue") return "hsl(209, 57%, 50%)";
    if (props.color === "gray") return "#808080";
    return "#fff";
  }};

  &:hover {
    transform: scale(1.3);
  }
`;

function Dots() {
  return (
    <StyledDot>
      <Dot color="blue" />
      <Dot color="gray" />
      <Dot />
    </StyledDot>
  );
}

export default Dots;
