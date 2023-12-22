import { ChakraProvider } from "@chakra-ui/react";
import "../globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
