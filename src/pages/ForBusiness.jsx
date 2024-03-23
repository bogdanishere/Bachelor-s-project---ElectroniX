import styled from "styled-components";

import ButtonsFunctionality from "../UI/ButtonsFunctionality";
import Footer from "../UI/Footer";
import Header from "./Clients/Header";
import NavBar from "./Clients/NavBar";
import Sidebar from "./Clients/Sidebar";

const Title = styled.h2`
  color: var(--color-grey-900);
`;

const Text = styled.p`
  margin: 10px 0;
  line-height: 1.6;
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

const StyledForBusiness = styled.div`
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--color-grey-700);
`;

function ForBusiness() {
  return (
    <>
      <NavBar />
      <StyledAppLayout>
        <Sidebar />
        <Header />
        <Main>
          <ButtonsFunctionality />
          <StyledForBusiness>
            <Title>Pentru Afaceri</Title>
            <Text>
              ElectroniX introduce secțiunea, Pentru Afaceri, dedicată exclusiv
              companiilor și profesioniștilor care caută soluții tehnologice
              personalizate pentru a-și maximiza eficiența și productivitatea.
            </Text>
            <Text>
              Oferta noastră include o gamă largă de produse și servicii, de la
              echipamente IT și soluții de stocare, până la dispozitive
              inteligente și soluții de securitate cibernetică.
            </Text>
            <Title>Soluții Personalizate și Suport Tehnic</Title>
            <Text>
              Beneficiați de consultanță specializată și suport tehnic pentru a
              alege cele mai bune soluții pentru afacerea dumneavoastră.
            </Text>
          </StyledForBusiness>
        </Main>
        <Footer />
      </StyledAppLayout>
    </>
  );
}

export default ForBusiness;
