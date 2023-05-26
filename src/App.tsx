import {
  WagmiConfig,
  createClient,
  configureChains,
  Chain,
  useConnect,
  useSigner,
  useDisconnect,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const CHAIN_ID = 97;
const WALLET_CONNECT_PROJECT_ID = "3f930f8e56336b44761655d8a270144c";
const RPC_URL =
  "https://bsc-testnet.nodereal.io/v1/f9777f42cc9243f0a766937df1c6a5f3";

const bscExplorer = {
  name: "BscScan",
  url: "https://testnet.bscscan.com",
};

const chain: Chain = {
  id: CHAIN_ID,
  name: "BSC Testnet",
  network: "bsc-testnet",
  rpcUrls: {
    default: {
      http: [RPC_URL],
    },
    public: {
      http: [RPC_URL],
    },
  },
  blockExplorers: {
    default: bscExplorer,
    etherscan: bscExplorer,
  },
  nativeCurrency: {
    name: "BSC Native Token",
    symbol: "BNB",
    decimals: 18,
  },
};

const { provider } = configureChains([chain], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
  connectors: [
    new WalletConnectConnector({
      chains: [chain],
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
      },
    }),
  ],
});

function ConnectButton() {
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { data: signer } = useSigner();

  const onConnect = () =>
    connectAsync({ connector: connectors[0], chainId: CHAIN_ID });

  const fetchBalance = async () => {
    const balance = signer?.getBalance();
    console.log("Balance", balance);
  };

  return (
    <>
      {signer ? (
        <>
          <button onClick={fetchBalance}>Fetch balance</button>
          <button onClick={() => disconnectAsync()}>Disconnect</button>
        </>
      ) : (
        <button onClick={onConnect}>Connect</button>
      )}
    </>
  );
}

function App() {
  return (
    <WagmiConfig client={client}>
      <ConnectButton />
    </WagmiConfig>
  );
}

export default App;
