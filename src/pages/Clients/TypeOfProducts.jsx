import styled from "styled-components";
import ProductCart from "../../UI/ProductCart";

const StyledTypeOfProducts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
`;

const StyledButton = styled.button`
  width: 5rem;
  height: auto;
  background-color: var(--color-primary);
  color: var(--color-text);
  border: none;
  border-radius: 10rem;
  font-size: 1.2rem;
  padding: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: var(--color-primary-light);
  }
`;
const StyledSpan = styled.span`
  width: auto;
  height: auto;
  color: black;
  border: none;

  font-size: 1.2rem;
  padding: 1rem;
  font-weight: bold;
`;

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

const ProductsNotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-weight: bold;
  width: 100vh;
  flex-direction: column;
`;

const ProductList = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(4, 1fr);
  gap: 3.2rem;

  @media (max-width: 1800px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1370px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 1050px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

function TypeOfProducts({
  data,
  title = "Recomandari",
  page = null,
  goToPage,
}) {
  return (
    <StyledTypeOfProducts>
      <StyledHeader>{title}</StyledHeader>
      <ProductList>
        {data.length === 0 && Number(page) === 1 && (
          <ProductsNotFound>
            <h1>Ne pare rau dar nu avem produsul pe care il cautati</h1>
            <h1>Va rugam incercati altul din gama noastra de produse</h1>
          </ProductsNotFound>
        )}

        {data?.map((product) => (
          <ProductCart
            key={product.product_id}
            name={product.name}
            price={product.price}
            image={product.imageURLs}
            fullName={product.name}
            idx={product.product_id}
            pricesCurrency={product.currency}
            provider={product.prices_merchant}
            rating={product.rating}
            numberOfRatings={product.nr_rating}
          />
        ))}
      </ProductList>

      {page !== null && (
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
          <StyledButton
            onClick={() => goToPage(parseInt(page) - 1)}
            disabled={page <= 1}
          >
            Prev
          </StyledButton>
          <StyledSpan>Page {page}</StyledSpan>
          <StyledButton onClick={() => goToPage(parseInt(page) + 1)}>
            Next
          </StyledButton>
        </div>
      )}
    </StyledTypeOfProducts>
  );
}

export default TypeOfProducts;
