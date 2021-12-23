import {
  BrowserRouter as Router,
  Route,
  BrowserRouter,
  Routes,
} from "react-router-dom";
import Detail from "./Routes/Components/Detail";
import Header from "./Routes/Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import TV from "./Routes/TV";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/movies/:movieId" element={<Detail />} />
          <Route path="/tv/:tvId" element={<Detail />} />
        </Route>

        <Route path="/tv" element={<TV />}>
          <Route path="show/:tvId" element={<Detail />} />
        </Route>

        <Route path="/search" element={<Search />}>
          <Route path="movies/:movieId" element={<Detail />} />
          <Route path="tv/:tvId" element={<Detail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
