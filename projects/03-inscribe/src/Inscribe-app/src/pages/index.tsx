import { Route, Routes } from "react-router-dom";
import { Home } from "./home";
import { Main } from "./main";
import { Deploy } from "./deploy";
import { Mint } from "./mint";
import { Burn } from "./burn";
import { QueryInscrible } from "./queryInscrible";

const routes = [
  { path: "/", Page: Home },
  { path: "/main", Page: Main },
  { path: "/deploy", Page: Deploy },
  { path: "/mint", Page: Mint },
  { path: "/burn", Page: Burn },
  { path: "/queryInscrible", Page: QueryInscrible },
];

function Routing() {
  const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);
  return <Routes>{getRoutes()}</Routes>;
}

export { Routing };
