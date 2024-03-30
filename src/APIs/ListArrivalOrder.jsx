import { createContext, useContext, useEffect, useState } from "react";

const ListArrivalOrderContext = createContext();

export const useListArrivalOrder = () => useContext(ListArrivalOrderContext);

function ListArrivalOrder({ children }) {
  const [listArrivalOrder, setListArrivalOrder] = useState([]);

  return (
    <ListArrivalOrderContext.Provider
      value={{ listArrivalOrder, setListArrivalOrder }}
    >
      {children}
    </ListArrivalOrderContext.Provider>
  );
}

export default ListArrivalOrder;
