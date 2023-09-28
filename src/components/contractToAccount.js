import Connex from "@vechain/connex";

const connex = new Connex({
  node: "https://mainnet.veblocks.net",
  network: "main"
});

const contractToAccount = {
  "0xf4d82631be350c37d92ee816c2bd4d5adf9e6493": connex.thor.account(
    "0xf4d82631be350c37d92ee816c2bd4d5adf9e6493"
  ),
  "0x523bef286ac6b08eb1a9db765970852b086903fa": connex.thor.account(
    "0x523bef286ac6b08eb1a9db765970852b086903fa"
  ),
  "0xc766ddd21f14862ef426f15bfb28573fdad8bc51": connex.thor.account(
    "0xc766ddd21f14862ef426f15bfb28573fdad8bc51"
  ),
  "0x862b1cb1c75ca2e2529110a9d43564bd5cd83828": connex.thor.account(
    "0x862b1cb1c75ca2e2529110a9d43564bd5cd83828"
  )
};

export default contractToAccount;
