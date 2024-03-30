import { useAddedToCart } from "../APIs/AddToCart";
import styled from "styled-components";
import { FaHeart } from "react-icons/fa6";
import styles from "./ProductCart.module.css";
import StarRating from "./StarRating";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { convertUSDtoRON, formatCurrency } from "../helpers/helpers";
import { useState } from "react";
import { set } from "react-hook-form";
import { useConvertPrice } from "../APIs/ConvertPrice";

const StyledCart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledProductCart = styled.div`
  max-width: 280px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  font-family: Arial, sans-serif;
`;

const Img = styled.img`
  max-width: 100%;
  height: auto;
  width: 300px;
  height: 300px;
`;

const ProductImage = styled.div`
  text-align: center;
  background-color: #fff;
`;

const ProductDetails = styled.div`
  padding: 1rem;
`;

const FavoriteProducts = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 0.5rem;
`;

const DiscountLabel = styled.span`
  display: flex;
  background-color: #e74c3c;
  color: white;
  justify-content: center;
  align-items: center;
  padding: 2px;
  font-size: 0.8rem;
  width: 50%;
  height: 1.5rem;
  border-radius: 1rem;
`;

const ProductName = styled.h2`
  font-size: 1rem;
  margin: 10px 0;
  text-align: center;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Stars = styled.span`
  color: #f1c40f;
`;

const RatingValue = styled.span`
  padding-top: 9px;
  color: #666;
  height: 21px;
  font-size: 0.8rem;
`;
const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Price = styled.span`
  font-size: 1.2rem;
  color: #e74c3c;
  font-weight: bold;
`;

const ProductFooter = styled.div`
  padding: 10px;
  background-color: #f8f8f8;
  text-align: center;
`;
const AddToCartBtn = styled.button`
  width: 100%;
  height: auto;
  background-color: hsl(239, 77%, 54%);
  color: #dee2e6;
  border: none;
  border-radius: 10rem;
  font-size: 1.2rem;
  padding: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
`;

function ProductCart({
  name,
  price,
  image,
  fullName,
  idx,
  pricesCurrency,
  provider,
  rating,
  numberOfRatings,
}) {
  const { setAddedShopping, setAddedWishList } = useAddedToCart();

  function handleAddToCart(idx, fullName, provider) {
    setAddedShopping((prevItems) => {
      const existingProductIndex = prevItems.findIndex(
        (item) => item.id === idx
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
            id: idx,
            name: fullName,
            number: 1,
            price: price,
            provider: provider,
            currency: pricesCurrency,
          },
        ];
      }
    });
  }
  function handleWishies(idx, fullName) {
    setAddedWishList((prevItems) => {
      const existingProductIndex = prevItems.findIndex(
        (item) => item.id === idx
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
            id: idx,
            name: fullName,
          },
        ];
      }
    });
  }

  const [priceRON, setPriceRON] = useState(0);

  convertUSDtoRON(price, pricesCurrency).then((result) => {
    setPriceRON(result);
  });

  const { priceInRON } = useConvertPrice();

  function handleImageError(e) {
    e.currentTarget.src = "https://via.placeholder.com/300";
    e.currentTarget.alt = "Failed to load image";
    e.currentTarget.onerror = null;
  }

  function typeOfImage(image) {
    if (image.split(",")[0].includes("http")) {
      return image.split(",")[0];
    } else {
      return image;
    }
  }

  return (
    <StyledCart>
      <StyledProductCart>
        <div className={styles["product-image"]}>
          <Link to={`/electronix/product/search/${idx}`}>
            <img
              src={typeOfImage(image)}
              alt={name}
              onError={handleImageError}
              style={{ width: "300px", height: "300px" }}
            />
          </Link>
        </div>

        <div className={styles["product-details"]}>
          <div className={styles["product-details-adding"]}></div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingRight: "0.5rem",
            }}
          >
            <span className={styles["product-discount-label"]}>
              {provider.slice(0, 17)}
            </span>
            <div
              onClick={() => {
                handleWishies(idx, fullName);
                toast.success("Produsul a fost adaugat la favorite!");
              }}
            >
              <FaHeart style={{ fontSize: "2rem", cursor: "pointer" }} />
            </div>
          </div>
          <h2 className={styles["product-title"]}>
            {fullName.split(" ").slice(0, 5).join(" ")}
          </h2>
          <div className={styles["product-rating"]}>
            <span className={styles["stars"]}>
              <StarRating
                size={"16"}
                disableHoverEffect={true}
                defaultRating={Number(rating)}
                disableRatingMessage={true}
                color={"var(--color-brand-500)"}
                cursor=""
              />
            </span>

            <span className={styles["rating-value"]}>
              {rating} ({numberOfRatings})
            </span>
          </div>
          <div className={styles["product-price"]}>
            <span className={styles["price"]}>
              {priceInRON === false ? (
                <>
                  {price} {pricesCurrency}
                </>
              ) : (
                <>{formatCurrency(priceRON)}</>
              )}
            </span>
          </div>
        </div>
        <div className={styles["product-footer"]}>
          <button
            onClick={() => {
              handleAddToCart(idx, fullName, provider);
              toast.success("Produsul a fost adaugat in cos!");
            }}
            className={styles["add-to-cart-btn"]}
          >
            Add to cart
          </button>
        </div>
      </StyledProductCart>
    </StyledCart>
  );
}

export default ProductCart;
