import styled from "styled-components";

import Footer from "../UI/Footer";
import NavBar from "./Clients/NavBar";
import Sidebar from "./Clients/Sidebar";
import Header from "./Clients/Header";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../Spinner";
import TypeOfProducts from "./Clients/TypeOfProducts";

import ButtonsFunctionality from "../UI/ButtonsFunctionality";
import { useNavigate, useParams } from "react-router-dom";
import { useSortProducts } from "../APIs/SortProducts";
import { useAddedToCart } from "../APIs/AddToCart";
import PageNotFetch from "../../PageNotFetch";

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

function Clients() {
  const { page } = useParams();
  const { sort } = useSortProducts();
  const navigate = useNavigate();

  const goToPage = (newPage) => {
    navigate(`/electronix/${newPage}`);
  };

  const fetchProducts = async () => {
    const response = await fetch(
      `http://127.0.0.1:8005/product/${page}?sort=${sort}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["products", page, sort],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <PageNotFetch error={error.message} />;
    // return <div>Error: {error.message}</div>;
  }

  const rawItems = localStorage.getItem("knnProducts");
  let items = [];

  if (rawItems && rawItems !== "undefined") {
    try {
      items = JSON.parse(rawItems);
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", error);
    }
  }

  console.log(items);

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
            title="Produsele noastre cele mai cautate"
            page={page}
            goToPage={goToPage}
          />
          {items?.length !== 0 && (
            <TypeOfProducts
              key={"knn"}
              data={items}
              title="Produsele pe baza cautarii dumneavoastra"
            />
          )}
        </Main>
        <Footer />
      </StyledAppLayout>
    </>
  );
}

export default Clients;
