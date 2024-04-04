import { useNavigate } from "react-router-dom";
import { convertUSDtoRON, formatCurrency } from "../helpers/helpers";
import { useConvertPrice } from "../APIs/ConvertPrice";
import { useEffect, useState } from "react";

function ListArrivalOrders({ order }) {
  const navigate = useNavigate();
  const { priceInRON } = useConvertPrice();
  const [price, setPrice] = useState(0);
  const handleNavigateToProduct = (id) => {
    navigate(`/electronix/product/search/${id}`);
  };

  useEffect(() => {
    if (priceInRON) {
      convertUSDtoRON(order.price).then((data) => {
        setPrice(data);
      });
    }

    if (!priceInRON) {
      setPrice(order.price);
    }
  }, [priceInRON, order.price]);

  return (
    <h3
      style={{ cursor: "pointer", paddingTop: "1rem" }}
      onClick={() => handleNavigateToProduct(order.product_id)}
    >
      {order.quantity} x {order.product_name} - Pret:{" "}
      {priceInRON
        ? formatCurrency(price)
        : formatCurrency(order.price, order.currency)}
      {order.arrival_time && ` - Ora livrarii: ${order.arrival_time}`}
      {"  -  "}Status comanda: {order.status}
    </h3>
  );
}

export default ListArrivalOrders;
