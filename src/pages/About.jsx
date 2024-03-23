import ButtonsFunctionality from "../UI/ButtonsFunctionality";
import Footer from "../UI/Footer";
import Header from "./Clients/Header";
import NavBar from "./Clients/NavBar";
import Sidebar from "./Clients/Sidebar";
import styled from "styled-components";

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

const StyledAbout = styled.div`
  font-size: 1.6rem;
  line-height: 1.6;
  color: var(--color-grey-700);
`;

function About() {
  return (
    <>
      <NavBar />
      <StyledAppLayout>
        <Sidebar />
        <Header />
        <Main>
          <ButtonsFunctionality />
          <StyledAbout>
            ElectroniX reprezintă culminarea eforturilor noastre de a aduce
            tehnologia mai aproape de consumatorii din România, oferind o
            platformă online intuitivă și accesibilă pentru achiziționarea unei
            game variate de produse electronice și electrocasnice. Lansat în
            2024, website-ul nostru se distinge prin ușurința de navigare,
            design modern și un proces simplificat de căutare și cumpărare,
            facilitând accesul utilizatorilor la ultimele inovații din domeniul
            tehnologic. Cu o varietate impresionantă de articole, de la
            laptopuri și smartphone-uri la frigidere și mașini de spălat,
            ElectroniX își propune să satisfacă nevoile tehnologice ale fiecărui
            client. Produsele noastre sunt selecționate cu grijă, asigurându-ne
            că fiecare articol listat pe site îndeplinește standarde înalte de
            calitate și performanță. Funcționalitatea de căutare avansată
            permite utilizatorilor să filtreze produsele după diverse criterii,
            inclusiv preț, producător, specificații tehnice și recenzii ale
            clienților, asigurând o experiență de shopping personalizată și
            eficientă. Pe lângă aceasta, ElectroniX oferă descrieri detaliate și
            fotografii de înaltă calitate pentru fiecare produs, facilitând
            luarea unei decizii informate. Conștienți de importanța suportului
            post-vânzare, ElectroniX pune la dispoziție o echipă de asistență
            dedicată, gata să răspundă oricăror întrebări sau preocupări legate
            de produsele noastre. De asemenea, procesul nostru de retur este
            simplu și rapid, asigurându-ne că fiecare client rămâne complet
            mulțumit de experiența sa de cumpărături. Prin angajamentul nostru
            către inovație și excelență în serviciile pentru clienți, ElectroniX
            aspiră să devină liderul pieței de comerț electronic din România,
            transformând fiecare achiziție într-o experiență plăcută și
            memorabilă.
          </StyledAbout>
        </Main>
        <Footer />
      </StyledAppLayout>
    </>
  );
}

export default About;
