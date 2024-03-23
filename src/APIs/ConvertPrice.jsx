import { createContext, useContext, useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

const ConvertPriceContext = createContext();

export const useConvertPrice = () => useContext(ConvertPriceContext);

function ConvertPrice({ children }) {
  const [priceInRON, setPriceInRON] = useState(false);
  const lastToastId = useRef(null);
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      if (lastToastId.current) {
        toast.dismiss(lastToastId.current);
      }

      const message = priceInRON
        ? "Ati convertit preturile in RON! Pentru a reveni la USD, apasati pe butonul de conversie!"
        : "Ati convertit preturile in USD! Pentru a reveni la RON, apasati pe butonul de conversie!";
      lastToastId.current = toast.success(message, {
        duration: 2000,
      });
    } else {
      didMount.current = true;
    }
  }, [priceInRON]);

  return (
    <ConvertPriceContext.Provider value={{ priceInRON, setPriceInRON }}>
      {children}
    </ConvertPriceContext.Provider>
  );
}

export default ConvertPrice;
