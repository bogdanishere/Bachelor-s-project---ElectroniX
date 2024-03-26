import { useQuery } from "@tanstack/react-query";
import Spinner from "../../Spinner";
import styled from "styled-components";
import { ProductsProvider } from "./ProductsProvider";

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

export default function DeleteProductsByProvider({ username, page, goToPage }) {
  const fetchShowProducts = async () => {
    const response = await fetch(
      `http://127.0.0.1:8005/showProductsByProductName/${username}/${page}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };
  const { data, error, isLoading } = useQuery({
    queryKey: ["showProductsByProvider", username, page],
    queryFn: fetchShowProducts,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>An error occurred: {error.message}</div>;
  console.log(data);

  return (
    <>
      {data.length === 0 && (
        <h1 style={{ textAlign: "center" }}>Nu mai aveti produse adaugate</h1>
      )}
      {data.length > 0 && (
        <h1 style={{ textAlign: "center" }}>
          Produsele furnizate de dvs sunt urmatoarele
        </h1>
      )}

      <div>
        {data.length > 0 &&
          data.map((item) => (
            <ProductsProvider key={item.product_id} item={item} />
          ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          padding: "2rem",
        }}
      >
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
    </>
  );
}
