import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Spinner from "../../../Spinner";
import { useQuery } from "@tanstack/react-query";
import { useSortProducts } from "../../APIs/SortProducts";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  grid-row: 1 / -1;

  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const FullScreenSpinnerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const Button = styled.button`
  width: 100%;
  height: auto;
  background-color: var(--color-grey-100);
  color: var(--color-grey-900);
  border: none;
  border-radius: 10rem;
  font-size: 1.2rem;
  padding: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
`;

function Sidebar() {
  const { setSort } = useSortProducts();
  const fetchSidebarProducts = async () => {
    const response = await fetch(`http://192.168.0.203:8005/product/2`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["SidebarProducts"],
    queryFn: fetchSidebarProducts,
  });

  if (isLoading) {
    return (
      <FullScreenSpinnerContainer>
        <Spinner />
      </FullScreenSpinnerContainer>
    );
  }

  if (error) {
    console.log(error);
    return <div>Error: {error.message}</div>;
  }

  const categories = data[0].categories.split(",").slice(0, 5);

  return (
    <StyledSidebar>
      <Button onClick={() => setSort("desc")}>Pret descrescator</Button>
      <Button onClick={() => setSort("asc")}>Pret crescator</Button>
      <Button onClick={() => setSort("none")}>Pret dupa relevanta</Button>

      <ShowTypesProducts data={categories} key={"test"} />
    </StyledSidebar>
  );
}

function ShowTypesProducts({ data }) {
  return (
    <>
      {data.map((el, index) => (
        <ListTypesProducts key={index} data={el} />
      ))}
    </>
  );
}

function ListTypesProducts({ data }) {
  const navigate = useNavigate();
  const { setSort } = useSortProducts();

  function handleNavProduct() {
    setSort("none");
    navigate(`/electronix/${data}/1`);
  }

  return <div onClick={handleNavProduct}>{data}</div>;
}

export default Sidebar;
