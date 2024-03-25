import { useQuery } from "@tanstack/react-query";
import Spinner from "../../../Spinner";
import Personal from "./PersonalRender";
import PersonalUI from "./PersonalUI";
import NavBar from "../Clients/NavBar";
import Footer from "../../UI/Footer";

function Providers() {
  function Header() {
    return (
      <>
        <div>Nume client</div>
        <div>Adresa</div>
        <div>Lista Produse</div>
        <div>Pret</div>
      </>
    );
  }
  const columns = ["1.2fr 1.5fr 1.2fr 1fr 1fr 1fr"];

  const name = "Furnizorule";

  const fetchProvidersConfirmations = async () => {
    const response = await fetch(`http://127.0.0.1:8005/comenzi`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["providersConfirmations"],
    queryFn: fetchProvidersConfirmations,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>An error occurred: {error.message}</div>;

  function acceptOrder() {
    console.log("Order accepted");
  }

  function rejectOrder() {
    console.log("Order rejected");
  }

  return (
    <>
      <NavBar />
      <Personal
        Header={Header}
        data={data}
        acceptOrder={acceptOrder}
        rejectOrder={rejectOrder}
        columns={columns}
        name={name}
      >
        <PersonalUI />
      </Personal>
      <Footer />
    </>
  );
}

export default Providers;
