import styled from "styled-components";

import ButtonsFunctionality from "../UI/ButtonsFunctionality";
import Footer from "../UI/Footer";
import Header from "./Clients/Header";
import NavBar from "./Clients/NavBar";
import Sidebar from "./Clients/Sidebar";

const Heading = styled.h2`
  color: var(--color-grey-900);
`;

const Paragraph = styled.p`
  color: var(--color-grey-700);
  line-height: 1.5;
`;

const StyledForPrivacyTerms = styled.div`
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--color-grey-700);
`;

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 20rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const Main = styled.main`
  padding: 4rem 4.8rem 6.4rem;
  background-color: var(--color-grey-50);
`;

function PrivacyTerms() {
  return (
    <>
      <NavBar />
      <StyledAppLayout>
        <Sidebar />
        <Header />
        <Main>
          <ButtonsFunctionality />
          <StyledForPrivacyTerms>
            <Heading>Termeni și Confidențialitate </Heading>
            <Paragraph>
              Această secțiune detaliază politicile noastre de confidențialitate
              și termenii de utilizare a site-ului. Este important să le citiți
              cu atenție pentru a înțelege cum sunt folosite informațiile
              dumneavoastră personale și care sunt drepturile dumneavoastră în
              legătură cu serviciile noastre.
            </Paragraph>
            <Paragraph>
              Pentru orice întrebări sau nelămuriri legate de aceste politici,
              vă rugăm să ne contactați.
            </Paragraph>
          </StyledForPrivacyTerms>
        </Main>
        <Footer />
      </StyledAppLayout>
    </>
  );
}

export default PrivacyTerms;
