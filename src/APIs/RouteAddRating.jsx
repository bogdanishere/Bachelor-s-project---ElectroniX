import { createContext, useContext, useState } from "react";

const AddRatingContext = createContext();

export const useAddRating = () => useContext(AddRatingContext);

function RouteAddRating({ children }) {
  const [product, setProduct] = useState({});

  const [reviewStar, setReviewStar] = useState(product.rating);

  return (
    <AddRatingContext.Provider
      value={{ reviewStar, setReviewStar, product, setProduct }}
    >
      {children}
    </AddRatingContext.Provider>
  );
}

export default RouteAddRating;
