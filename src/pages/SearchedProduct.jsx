import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./Clients/NavBar";
import styled from "styled-components";
import Sidebar from "./Clients/Sidebar";
import Header from "./Clients/Header";
import Footer from "../UI/Footer";
import TypeOfProducts from "./Clients/TypeOfProducts";
import ButtonsFunctionality from "../UI/ButtonsFunctionality";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../Spinner";
import { useSortProducts } from "../APIs/SortProducts";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 20rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const Main = styled.main`
  padding: 4rem 4.8rem 6.4rem;
  background-color: var(--color-grey-50);

  /* overflow: scroll; */
`;

function SearchedProduct() {
  const { product, page } = useParams();
  const { sort } = useSortProducts();
  const navigate = useNavigate();

  const goToPage = (newPage) => {
    navigate(`/electronix/${product}/${newPage}`);
  };

  const fetchSearchedProducts = async () => {
    const response = await fetch(
      `http://192.168.0.203:8005/product/${product}/${page}?sort=${sort}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["SearchedProducts", product, page, sort],
    queryFn: fetchSearchedProducts,
  });

  if (isLoading) return <Spinner />;

  if (error) return <div>Error: {error.message}</div>;

  if (isNaN(page)) {
    return <div>Error: Invalid page number</div>;
  }

  return (
    <>
      <NavBar />
      <StyledAppLayout>
        <Sidebar />
        <Header />
        <Main>
          <ButtonsFunctionality />
          <TypeOfProducts
            key={page}
            data={data}
            title={product}
            page={page}
            goToPage={goToPage}
          />
        </Main>
        <Footer />
      </StyledAppLayout>
    </>
  );
}

export default SearchedProduct;
