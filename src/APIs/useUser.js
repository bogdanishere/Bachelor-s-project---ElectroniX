import { useQuery } from "@tanstack/react-query";
import { useAddedToCart } from "./AddToCart";

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return { isLoading, user, isAuthenticated: user?.role === "authenticated" };
}

function getCurrentUser() {
  return;
}

// function getCurrentUser() {
//   const { email, password } = useAddedToCart();
//   return { email, password };
// }
