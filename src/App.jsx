import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";

import GlobalStyles from "./GlobalStyles";

import Spinner from "../Spinner";

// import Clients from "./pages/Clients";
// import Providers from "./pages/Providers";
// import Employee from "./pages/Employee";
// import Commands from "./UI/Commands";
// import PageNotFound from "../PageNotFound";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import FinishCommand from "./pages/FinishCommand";
// import SearchedProduct from "./pages/SearchedProduct";
// import Address from "./UI/Address";
// import ProductPageDetails from "./pages/ProductPageDetails";
// import About from "./pages/About";
// import ForBusiness from "./pages/ForBusiness";
// import PrivacyTerms from "./pages/PrivacyTerms";

import RouteLoginSignup from "./APIs/RouteLoginSignup";
import ProtectedRoute from "./components/ProtectedRoute";

import AddToCart from "./APIs/AddToCart";
import ProtectedRouteUsers from "./components/ProtectedRouteUsers";
import ProtectedClients from "./components/ProtectedClients";
import ProtectedEmployee from "./components/ProtectedEmployee";
import ProtectedProviders from "./components/ProtectedProviders";
import ProtectedAddressRoute from "./components/ProtectedAddressRoute";
import RouteAddRating from "./APIs/RouteAddRating";

import ConvertPrice from "./APIs/ConvertPrice";
import SortProducts from "./APIs/SortProducts";
import ArrivalOrder from "./pages/ArrivalOrder";
import ListArrivalOrder from "./APIs/ListArrivalOrder";

const Clients = lazy(() => import("./pages/Clients"));
const Employee = lazy(() => import("./pages/Employee"));
const Providers = lazy(() => import("./pages/Providers"));
const Commands = lazy(() => import("./UI/Commands"));
const PageNotFound = lazy(() => import("../PageNotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const FinishCommand = lazy(() => import("./pages/FinishCommand"));
const SearchedProduct = lazy(() => import("./pages/SearchedProduct"));
const Address = lazy(() => import("./UI/Address"));
const ProductPageDetails = lazy(() => import("./pages/ProductPageDetails"));
const About = lazy(() => import("./pages/About"));
const ForBusiness = lazy(() => import("./pages/ForBusiness"));
const PrivacyTerms = lazy(() => import("./pages/PrivacyTerms"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <AddToCart>
        <RouteAddRating>
          <RouteLoginSignup>
            <ProtectedRouteUsers>
              <ConvertPrice>
                <SortProducts>
                  <ListArrivalOrder>
                    <BrowserRouter>
                      <Suspense fallback={<Spinner />}>
                        <Routes>
                          <Route
                            index
                            element={<Navigate replace to="electronix/1" />}
                          ></Route>
                          <Route
                            path="electronix/:page"
                            element={
                              <ProtectedClients>
                                <Clients />
                              </ProtectedClients>
                            }
                          />
                          <Route
                            path="electronix/product/search/:productID"
                            element={<ProductPageDetails />}
                          />
                          <Route
                            path="electronix/:product/:page"
                            element={<SearchedProduct />}
                          />

                          <Route
                            path="electronix/address"
                            element={
                              <ProtectedAddressRoute>
                                <Address />
                              </ProtectedAddressRoute>
                            }
                          />

                          <Route
                            path="electronix/comands"
                            element={<Commands />}
                          />

                          <Route
                            path="electronix/form=login"
                            element={<Login />}
                          />
                          <Route
                            path="electronix/form=signup"
                            element={<Signup />}
                          />

                          <Route path="electronix/about" element={<About />} />
                          <Route
                            path="electronix/forbusiness"
                            element={<ForBusiness />}
                          />

                          <Route
                            path="electronix/privacyterms"
                            element={<PrivacyTerms />}
                          />

                          <Route
                            path="employee"
                            element={
                              <ProtectedEmployee>
                                <Employee />
                              </ProtectedEmployee>
                            }
                          />
                          <Route
                            path="providers/:page"
                            element={
                              <ProtectedProviders>
                                <Providers />
                              </ProtectedProviders>
                            }
                          />
                          <Route
                            path="success"
                            element={
                              <ProtectedRoute>
                                <FinishCommand />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/arrivalOrders"
                            element={<ArrivalOrder />}
                          />
                          <Route path="*" element={<PageNotFound />} />
                        </Routes>
                      </Suspense>
                    </BrowserRouter>

                    <Toaster
                      position="top-center"
                      gutter={12}
                      containerStyle={{ margin: "8px" }}
                      toastOptions={{
                        success: {
                          duration: 2000,
                        },
                        error: {
                          duration: 3000,
                        },
                        style: {
                          fontSize: "16px",
                          maxWidth: "500px",
                          padding: "16px 24px",
                          backgroundColor: "var(--color-grey-0)",
                          color: "var(--color-grey-700)",
                        },
                      }}
                    />
                  </ListArrivalOrder>
                </SortProducts>
              </ConvertPrice>
            </ProtectedRouteUsers>
          </RouteLoginSignup>
        </RouteAddRating>
      </AddToCart>
    </QueryClientProvider>
  );
}

export default App;
