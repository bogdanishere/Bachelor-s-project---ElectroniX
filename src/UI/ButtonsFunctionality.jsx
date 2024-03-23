import Modal from "./Modal";
import { useAddedToCart } from "../APIs/AddToCart";

function ButtonsFunctionality() {
  const {
    addedShopping,
    setAddedShopping,
    addedWishList,
    setAddedWishList,
    isShopping,
    setIsShopping,
    openWishList,
    setOpenWishList,
    login,
    setLogin,
  } = useAddedToCart();

  const toggleShopping = () => setIsShopping(!isShopping);
  const toggleWishies = () => setOpenWishList(!openWishList);
  const toggleLogin = () => setLogin(!login);
  return (
    <>
      <Modal type="login" isOpen={login} onClose={toggleLogin}>
        <Modal.Window>
          <Modal.Login />
        </Modal.Window>
      </Modal>

      <Modal type="favorites" isOpen={openWishList} onClose={toggleWishies}>
        <Modal.Window>
          <Modal.Wishies
            products={addedWishList}
            onProducts={setAddedWishList}
          />
        </Modal.Window>
      </Modal>

      <Modal type="shopping" isOpen={isShopping} onClose={toggleShopping}>
        <Modal.Window>
          <Modal.Products
            products={addedShopping}
            onProducts={setAddedShopping}
          />
        </Modal.Window>
      </Modal>
    </>
  );
}

export default ButtonsFunctionality;
