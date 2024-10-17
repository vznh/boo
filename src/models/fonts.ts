// [START models/fonts.ts]
import { Inter, Quattrocento, Noto_Sans } from "next/font/google";

export const InterHeading = Inter({
  weight: "200",
  subsets: ["latin"],
});

export const QuatHeading = Quattrocento({
  weight: "400",
  subsets: ["latin"]
});

export const InterBody = Inter({
  weight: "400",
  subsets: ["latin"],
});

export const NotoBody = Noto_Sans({
  weight: "400",
  subsets: ["latin"],
});

// [END models/fonts.ts]
