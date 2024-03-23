import { createContext, useContext, useState } from "react";

const SortProductsContext = createContext();

export const useSortProducts = () => useContext(SortProductsContext);

function SortProducts({ children }) {
  const [sort, setSort] = useState("none");

  return (
    <SortProductsContext.Provider value={{ sort, setSort }}>
      {children}
    </SortProductsContext.Provider>
  );
}

export default SortProducts;
