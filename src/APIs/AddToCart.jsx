import { createContext, useContext, useState } from "react";

const AddedContext = createContext();

export const useAddedToCart = () => useContext(AddedContext);

export default function AddToCart({ children }) {
  const [addedShopping, setAddedShopping] = useState([]);
  const [addedWishList, setAddedWishList] = useState([]);

  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("qwerty");
  const [name, setName] = useState("");
  const [typeUser, setTypeUser] = useState("");

  const [isShopping, setIsShopping] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const [login, setLogin] = useState(false);
  const [userLogin, setUserLogin] = useState(false);

  return (
    <AddedContext.Provider
      value={{
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
        userLogin,
        setUserLogin,
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
        reviewOpen,
        setReviewOpen,
        typeUser,
        setTypeUser,
      }}
    >
      {children}
    </AddedContext.Provider>
  );
}
