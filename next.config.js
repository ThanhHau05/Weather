/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
};
module.exports = nextConfig;
