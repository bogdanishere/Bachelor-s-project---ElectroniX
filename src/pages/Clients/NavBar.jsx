import styled from "styled-components";

import { CiSearch } from "react-icons/ci";
import { IoMdPerson } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { useAddedToCart } from "../../APIs/AddToCart";
import { CiMoneyCheck1 } from "react-icons/ci";

import { useNavigate } from "react-router-dom";
import electronicsLogo from "../../images/electronics-logo.png";
import image2 from "../../images/image2.jpg";
import image from "../../images/image.png";
import { useState } from "react";
import { useConvertPrice } from "../../APIs/ConvertPrice";
import { useSortProducts } from "../../APIs/SortProducts";
import { BiAlbum } from "react-icons/bi";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  gap: 2rem;
  padding-right: 2rem;
`;
const Logo = styled.div`
  min-width: 15rem;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
  position: relative;
`;

const StyledSearchBar = styled.div`
  width: 55.5rem;
  margin: 1px;
  padding: 5px;
  background-color: var(--color-brand-100);
  border-radius: 10rem;
  display: flex;
  align-items: center;
  height: 2.5rem;
`;

const SearchInput = styled.input`
  width: calc(100% - 2rem);
  padding: 10px;
  border: none;
  background-color: var(--color-brand-100);
  color: var(--color-grey-800);
  font-size: 1rem;
  border-radius: 10rem;
  padding-left: 1.5rem;
  margin: 2px;

  border: none;
  outline: none;
  box-shadow: none;
`;

const ButtonsGroup = styled.div`
  min-width: 15rem;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
  position: relative;
`;

const ImgIcon = styled.img`
  height: 4rem;
  width: 8rem;
`;

const StyledCiSearch = styled(CiSearch)`
  color: var(--color-grey-800);
  margin-right: 0.8rem;
  cursor: pointer;
`;

const styleButtons = {
  width: "1.8rem",
  height: "1.8rem",
  color: "lightblue",
};

function NavBar({ isClient = true }) {
  const navigate = useNavigate();

  function handleProducts() {
    setIsShopping((isOpen) => !isOpen);
  }

  function handleLogin() {
    setLogin((isOpen) => !isOpen);
  }

  function handleWishList() {
    setOpenWishList((isOpen) => !isOpen);
  }

  function handleNavigateToProduct() {
    navigate(`/electronix/${searchTyped}/1`);
  }

  function handleConvertion() {
    setPriceInRON((isOpen) => !isOpen);
  }

  function handleListCommands() {
    navigate("/arrivalOrders");
  }

  const [searchTyped, setSearchTyped] = useState("");

  const { setIsShopping, setOpenWishList, setLogin, userLogin } =
    useAddedToCart();

  const { name } = useAddedToCart();

  const { setPriceInRON } = useConvertPrice();
  const { setSort } = useSortProducts();
  function handleNavigateImage() {
    if (isClient) {
      setSort("none");
      navigate("/electronix/1");
    }
  }

  return (
    <Nav>
      <Logo>
        <ImgIcon
          src={image}
          alt="electronics-logo"
          onClick={() => handleNavigateImage()}
        />
      </Logo>
      {isClient && (
        <StyledSearchBar
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchTyped !== "") {
              handleNavigateToProduct();
            }
          }}
        >
          <SearchInput
            type="text"
            placeholder="Cauta..."
            value={searchTyped}
            onChange={(e) => setSearchTyped(e.target.value)}
          />
          <StyledCiSearch onClick={handleNavigateToProduct} />
        </StyledSearchBar>
      )}

      <ButtonsGroup>
        {name && <div>Bine ati venit, {name}</div>}
        {isClient && (
          <CiMoneyCheck1
            style={styleButtons}
            onClick={() => handleConvertion()}
          />
        )}

        {!userLogin ? (
          <IoMdPerson style={styleButtons} onClick={() => handleLogin()} />
        ) : (
          <>Nume</>
        )}
        {isClient && (
          <>
            <FaHeart style={styleButtons} onClick={() => handleWishList()} />
            <IoCart style={styleButtons} onClick={() => handleProducts()} />
            <BiAlbum
              style={styleButtons}
              onClick={() => handleListCommands()}
            />
          </>
        )}
      </ButtonsGroup>
    </Nav>
  );
}

export default NavBar;
