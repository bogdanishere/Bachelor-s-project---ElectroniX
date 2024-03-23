import { useAddedToCart } from "../APIs/AddToCart";
import Modal from "./Modal";

function ReviewButtonFunctionality() {
  const { reviewOpen, setReviewOpen } = useAddedToCart();

  const toggleReview = () => setReviewOpen(!reviewOpen);
  return (
    <Modal type="review" isOpen={reviewOpen} onClose={toggleReview}>
      <Modal.Window>
        <Modal.AddReview />
      </Modal.Window>
    </Modal>
  );
}

export default ReviewButtonFunctionality;
