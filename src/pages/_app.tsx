import "@/styles/globals.css";
import type { AppProps } from "next/app";
import ContentContainer from "@/components/ContentContainer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ContentContainer>
      <Component {...pageProps} />
    </ContentContainer>
  );
}
