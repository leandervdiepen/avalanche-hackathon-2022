import "../styles/globals.css";
import "../styles/components.css";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    // <Web3ReactProvider getLibrary={getLibrary}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    // </Web3ReactProvider>
  );
}

export default MyApp;
