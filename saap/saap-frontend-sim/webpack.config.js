const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;
const { DefinePlugin } = require("webpack");

const appPort = process.env.APP_PORT || '3034'; //Esse port é 

module.exports = (_, argv) => ({
  output: {
    publicPath: 'auto',
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: appPort,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images', // Diretório de saída das imagens
            },
          },
        ],
      },//npm install file-loader --save-dev
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "saap",
      filename: "remoteEntry.js",
      remotes: {
        //Aqui listo os tres pontos de acesso ao framework
        frameworkdesv: 'framework@http://localhost:3000/remoteEntry.js',
        frameworkhomo: 'framework@https://framework-homo.policiacivil.go.gov.br/remoteEntry.js',
        frameworkprod: 'framework@https://framework.policiacivil.go.gov.br/remoteEntry.js',
        
      },
      exposes: {
        //Aconselho a não mudar o nome do componente exposto.
        "./Appbase": "./src/components/Appbase.tsx",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }), 
  ],
});


