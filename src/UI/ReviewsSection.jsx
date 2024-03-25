import { useQuery } from "@tanstack/react-query";
import StarRating from "./StarRating";
import Spinner from "../../Spinner";
import styled from "styled-components";

const StyledReviewsSection = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

function ReviewsSection({ productID }) {
  const fetchReviews = async () => {
    const response = await fetch(
      `http://127.0.0.1:8005/get_review/${productID}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const {
    data: reviews,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["Reviews", productID],
    queryFn: fetchReviews,
  });

  if (isLoading) return <Spinner />;

  if (error) return <div>Error: {error.message}</div>;
  return (
    <StyledReviewsSection>
      <h1>Cum este vazut de catre alti utilizatori</h1>
      {reviews.length > 0 ? (
        reviews.map((review, index) => {
          return (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "2rem",
                border: "1px solid var(--color-grey-300)",
                borderRadius: "1rem",
              }}
            >
              <h2>{review.title}</h2>
              <h3>{review.review}</h3>
              <StarRating
                size={"32"}
                disableHoverEffect={true}
                defaultRating={Number(review.rating)}
                disableRatingMessage={true}
                color={"var(--color-brand-500)"}
                cursor=""
              />
              <h3>{review.date_added}</h3>
              <h3>Review By: {review.client_username}</h3>
            </div>
          );
        })
      ) : (
        <h2>Momentan nu avem review-uri la acest produs</h2>
      )}
    </StyledReviewsSection>
  );
}

export default ReviewsSection;
