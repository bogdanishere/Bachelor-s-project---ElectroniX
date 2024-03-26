import { useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import toast from "react-hot-toast";

const Button = styled.button`
  border: 0;
  outline: none;
  border-radius: 2rem;
  padding: 1.5rem 0;
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  background: var(--color-blue-700);
  color: #fff;
  cursor: pointer;
  transition: all 0.5s ease;
  width: 15rem;
  margin: 8px 0;
  &:hover,
  &:focus {
    background: var(--color-indigo-700);
  }
`;

export function ProductsProvider({ item: data }) {
  const queryClient = useQueryClient();
  const date = new Date(data.dateAdded);
  const formattedDate = date.toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  function typeOfImage(image) {
    if (image.split(",")[0].includes("http")) {
      return image.split(",")[0];
    } else {
      return image;
    }
  }
  function handleImageError(e) {
    e.currentTarget.src = "https://via.placeholder.com/300";
    e.currentTarget.alt = "Failed to load image";
    e.currentTarget.onerror = null;
  }
  async function handleDeleteProduct() {
    try {
      const response = await fetch(
        `http://127.0.0.1:8005/deleteProductsByProvider`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id: data.product_id }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);
      queryClient.invalidateQueries("showProductsByProvider");
      toast.success("Produsul a fost sters cu succes!");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingLeft: "2rem",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <Button onClick={() => handleDeleteProduct()}>Stergeti produsul</Button>
      <img
        src={typeOfImage(data.imageURLs)}
        alt={data.name}
        style={{ width: "300px", height: "300px" }}
        onError={(e) => handleImageError(e)}
      />
      <div>
        <h1>Nume: {data.name.slice(0, 20)}</h1>
        <h1>Pret: {data.price}</h1>
        <h1>Valuta: {data.currency}</h1>
        <h1>Media recenziilor: {data.rating}</h1>
        <h1>Numarul de recenzii: {data.nr_rating}</h1>
        <h1>Data aparitiei: {formattedDate}</h1>
      </div>
    </div>
  );
}
