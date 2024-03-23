import { useNavigate } from "react-router-dom";
import StarRating from "../UI/StarRating";
import { useAddedToCart } from "../APIs/AddToCart";
import styled from "styled-components";
import toast from "react-hot-toast";
import ProductCart from "../UI/ProductCart";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../Spinner";
import ReviewButtonFunctionality from "../UI/ReviewButtonFunctionality";
import { useEffect } from "react";
import { useAddRating } from "../APIs/RouteAddRating";
import ReviewsSection from "../UI/ReviewsSection";

const ProductList = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(4, 1fr);
  gap: 3.2rem;
  padding-top: 5rem;
  padding-bottom: 5rem;
`;

const StyledSingleProduct = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-direction: column;
`;

const StyledButton = styled.button`
  text-align: center;
  width: 15rem;
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

const StyledRating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const StyledCaracterstics = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledH3 = styled.h3`
  font-size: 1.5rem;
`;

export function SingleProduct({ product, id }) {
  const {
    name,
    imageURLs: image,
    categories,
    rating,
    price,
    description,
    prices_merchant: provider,
    nr_rating: nrRating,
    currency,
  } = product;

  const { setAddedShopping, setAddedWishList } = useAddedToCart();
  const { setReviewOpen, name: username } = useAddedToCart();

  const { setReviewStar, setProduct } = useAddRating();
  const navigate = useNavigate();

  function handleAddToCart(id, name, provider) {
    setAddedShopping((prevItems) => {
      const existingProductIndex = prevItems.findIndex(
        (item) => item.id === id
      );
      if (existingProductIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingProductIndex] = {
          ...newItems[existingProductIndex],
          number: newItems[existingProductIndex].number + 1,
        };
        return newItems;
      } else {
        return [
          ...prevItems,
          {
            id: id,
            name: name,
            number: 1,
            price: price,
            provider: provider,
            currency,
          },
        ];
      }
    });
  }
  function handleWishies(id, name) {
    setAddedWishList((prevItems) => {
      const existingProductIndex = prevItems.findIndex(
        (item) => item.id === id
      );
      if (existingProductIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingProductIndex] = {
          ...newItems[existingProductIndex],
          number: newItems[existingProductIndex].number + 1,
        };
        return newItems;
      } else {
        return [
          ...prevItems,
          {
            id,
            name,
          },
        ];
      }
    });
  }

  function handleNavigateBack() {
    navigate(-1);
  }

  function handleNavigateToReview() {
    if (username.length === 0) {
      navigate("/electronix/form=login");
    } else {
      setReviewOpen((isOpen) => !isOpen);
    }
  }
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

  useEffect(() => {
    setProduct(product);
  }, [product, setProduct]);

  const fetchSearchNewProducts = async () => {
    const response = await fetch(
      `http://192.168.0.203:8005/product/${name.split("/").join(",")}/1`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["SearchNewProducts", product],
    queryFn: fetchSearchNewProducts,
  });

  if (isLoading) return <Spinner />;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <StyledSingleProduct>
      <StyledCaracterstics>
        <StyledButton
          style={{ width: "auto", borderRadius: "0", padding: "0.5rem 1rem" }}
          onClick={handleNavigateBack}
        >
          Inapoi
        </StyledButton>
        <StyledH3>{categories}</StyledH3>
      </StyledCaracterstics>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          paddingBottom: "2rem",
          paddingTop: "2rem",
        }}
      >
        <img
          src={typeOfImage(image)}
          alt={name}
          style={{ width: "450px", height: "450px" }}
          onError={(e) => handleImageError(e)}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>{name}</h1>
          <StyledRating>
            <StarRating
              size={"32"}
              disableHoverEffect={true}
              defaultRating={Number(rating)}
              disableRatingMessage={true}
              color={"var(--color-brand-500)"}
              cursor=""
            />
            <h1>
              {rating} ({nrRating})
            </h1>
          </StyledRating>
          <StyledButton
            onClick={() => {
              handleAddToCart(id, name, provider);
              toast.success("Produsul a fost adaugat in cos!");
            }}
          >
            Adauga in cos
          </StyledButton>
          <StyledButton
            onClick={() => {
              handleWishies(id, name);
              toast.success("Produsul a fost adaugat la favorite!");
            }}
          >
            Adauga la Favorite
          </StyledButton>
        </div>
      </div>
      <h1>Descriere</h1>
      <h2>{description}</h2>
      <h1 style={{ paddingTop: "5rem" }}>
        Avem si alte produse care se pot asocia cu cel cautat de dvs.
      </h1>
      <ProductList>
        {data?.map((product) => {
          if (product.product_id === id) {
            return null;
          }
          return (
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
          );
        })}
      </ProductList>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2rem",
          width: "100%",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <h1>Review-uri({nrRating})</h1>
          <div style={{ fontSize: "5rem" }}>{rating}</div>
          <StarRating
            size={"32"}
            disableHoverEffect={true}
            defaultRating={Number(rating)}
            disableRatingMessage={true}
            color={"var(--color-brand-500)"}
            cursor=""
          />

          <h1>{nrRating} review-uri</h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <h2>Detii sau ai utilizat produsul?</h2>
          <h3>Spune-ti parerea acordand o nota produsului</h3>
          <StarRating
            size={"32"}
            defaultRating={Number(rating)}
            color={"var(--color-brand-500)"}
            onSetRatingHandle={(rating) => setReviewStar(rating)}
          />
          <ReviewButtonFunctionality />
          <StyledButton onClick={handleNavigateToReview}>
            Adauga un review
          </StyledButton>
        </div>
      </div>
      <ReviewsSection productID={id} />
    </StyledSingleProduct>
  );
}
