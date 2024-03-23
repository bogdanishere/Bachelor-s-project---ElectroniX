import styled from "styled-components";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

function Header() {
  return (
    <StyledHeader>
      <div className="main">Bine ati venit la Magazinul nostru, ElextroniX</div>
    </StyledHeader>
  );
}

export default Header;
