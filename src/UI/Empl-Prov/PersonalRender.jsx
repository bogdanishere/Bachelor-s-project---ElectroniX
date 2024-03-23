import { createContext, useContext } from "react";
import { Button } from "./UIElements";

const PersonalContext = createContext();

export const usePersonal = () => useContext(PersonalContext);

function Personal({
  children,
  data,
  acceptOrder,
  rejectOrder,
  Header,
  columns,
  name,
}) {
  function Body({ listTheData }) {
    let username,
      date,
      id,
      approved,
      orderId,
      productName,
      addressId,
      employeeUsername,
      providerUsername;

    if ("address_id" in listTheData) {
      ({
        client_username: username,
        address_id: addressId,
        date_created: date,
        employee_approved: approved,
        employee_username: employeeUsername,
        order_id: id,
      } = listTheData);
    } else if ("order_detail_id" in listTheData) {
      ({
        order_detail_id: id,
        order_id: orderId,
        provider_approved: approved,
        provider_username: providerUsername,
        product_name: productName,
        date_created: date,
      } = listTheData);
    }

    const isApproved = Boolean(approved);

    if (isApproved) return null;

    const addressAdded = addressId ? "Da" : "Nu";

    return (
      <>
        <div>{id}</div>
        <div>{productName || addressAdded}</div>
        <div>{date}</div>
        <div>{employeeUsername || providerUsername}</div>
        <div>
          {approved === 0
            ? "Asteptam raspunsul dumneavoastra"
            : "Comanda a fost acceptata"}
        </div>
        <Button onClick={() => acceptOrder(id)}>Accepta comanda</Button>
        <Button onClick={() => rejectOrder(id, orderId)}>Refuza comanda</Button>
      </>
    );
  }

  return (
    <PersonalContext.Provider value={{ data, columns, name, Header, Body }}>
      {children}
    </PersonalContext.Provider>
  );
}

export default Personal;
