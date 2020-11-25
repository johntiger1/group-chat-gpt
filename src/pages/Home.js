import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { styled } from "@material-ui/core/styles";
import Loading from "../components/animations/Loading";

const Chat = lazy(() => import("../components/Chat"));
const Sidebar = lazy(() => import("../components/Sidebar"));
const About = lazy(() => import("./About"));

export default function Home() {
  const AppBody = styled(Box)({
    display: "flex",
    backgroundColor: "#ededed",
    marginTop: " -30px",
    height: "90vh",
    width: "90vw",
    boxShadow: "-1px 4px 20px -6px rgba(0, 0, 0, 0.5)",
  });
  return (
    <Router>
      <AppBody>
        <Suspense fallback={<Loading title="Loading Home.." />}>
          <Sidebar />
          <Switch>
            <Suspense fallback={<Loading title="Loading Chat Body.." />}>
              <Route path="/rooms/:roomId" component={Chat} />
            </Suspense>
          </Switch>
        </Suspense>
      </AppBody>
    </Router>
  );
}
