import "../styles/globals.css";
import "../styles/components.css";
import Navbar from "../components/Navigation";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
