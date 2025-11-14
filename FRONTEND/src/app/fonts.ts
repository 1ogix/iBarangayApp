import localFont from "next/font/local";

// You can add the Inter font files to your /public/fonts directory
// if you want to use them locally as well. For now, this focuses on Poppins.

export const poppins = localFont({
  src: [
    {
      path: "../../public/fonts/Poppins-Regular.otf",
      weight: "400",
    },
    { path: "../../public/fonts/Poppins-Bold.otf", weight: "700" },
  ],
  variable: "--font-poppins",
});
