import { useParams } from "react-router-dom";
import NavBar from "./Clients/NavBar";
import styled from "styled-components";
import Sidebar from "./Clients/Sidebar";
import Header from "./Clients/Header";
import Footer from "../UI/Footer";
import ButtonsFunctionality from "../UI/ButtonsFunctionality";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../Spinner";
import { SingleProduct } from "./SingleProduct";

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

function ProductPageDetails() {
  const { productID } = useParams();

  const fetchProductPageDetails = async () => {
    const response = await fetch(
      `http://127.0.0.1:8005/product/product/name/${productID}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["productPageDetails", productID],
    queryFn: fetchProductPageDetails,
  });

  if (isLoading) return <Spinner />;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <NavBar />
      <StyledAppLayout>
        <Sidebar />
        <Header />
        <Main>
          <ButtonsFunctionality />
          <SingleProduct
            product={data}
            key={data.product_id}
            id={data.product_id}
          />
        </Main>
        <Footer />
      </StyledAppLayout>
    </>
  );
}

export default ProductPageDetails;
