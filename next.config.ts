import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  // 90 is reserved for hero photography and the concept previews.
  images: { qualities: [75, 90] },
};
export default config;
