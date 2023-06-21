import React from "react";
import Header from "./component/layout/hader/Header.js"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Webfont from "webfontloader"
import Footer from "./component/layout/footer/Footer.js";
import Home from "./component/Home/Home.js"

function App() {

  // React.useEffect(() => {
  //   Webfont.load({
  //     google: {
  //       famlilies: ["Roboto", "Droid Sans", "Chilanka"]
  //     }
  //   })

  // }, [])

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;