// [START models/fonts.ts]
import { Inter, Roboto } from "next/font/google";

export const InterHeading = Inter({
  weight: "200",
  subsets: ['latin'],

})

export const InterBody = Inter({
  weight: "400",
  subsets: ['latin']
})


// [END models/fonts.ts]
