import './App.css'
import Connex from "@vechain/connex"
import { useState } from 'react';
import { useEffect } from 'react';
import filters from './components/filters'

const startDateTimeString = "9/3/23 9:30 PM UTC";
const startTimestamp = Date.parse(startDateTimeString) / 1000; 

const endDateTimeString = "9/24/23 9:30 PM UTC";
const endTimestamp = Date.parse(endDateTimeString) / 1000; 

const connex = new Connex({
  node: 'https://mainnet.veblocks.net',
  network: 'main'
})

const nftCollections = {
  "0xf4d82631be350c37d92ee816c2bd4d5adf9e6493": "OG Mino Mob",
  "0x523bef286ac6b08eb1a9db765970852b086903fa": "Mutant Mino Mob",
  "0xc766ddd21f14862ef426f15bfb28573fdad8bc51": "Multiverse Mino Mob",
  "0x862b1cb1c75ca2e2529110a9d43564bd5cd83828": "Elixir"
};

async function fetchData(blockHeight, token, amt) {
  const response = await fetch("https://api.vechain.energy/v1/call/main", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      revision: blockHeight,
      clauses: [
        {
          to: "0x576da7124c7bb65a692d95848276367e5a844d95",
          abi: {
            name: "getAmountsOut",
            inputs: [
              {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256"
              },
              {
                internalType: "address[]",
                name: "path",
                type: "address[]"
              }
            ],
            outputs: [
              {
                internalType: "uint256[]",
                name: "amounts",
                type: "uint256[]"
              }
            ],
            type: "function"
          },
          args: [
            "1000000000000000000",
            [
              token,
              "0x45429A2255e7248e57fce99E7239aED3f84B7a53",
              "0x4E17357053dA4b473e2daa2c65C2c949545724b8"
            ]
          ]
        }
      ]
    })
  });

  const data = await response.json();
  const numData = parseFloat(data[1]);
  const firstAmount = (numData * amt).toString();
  const vetAmount = Math.floor(firstAmount / 1e18);

  return vetAmount;
}


export default function App() {
  const [transfers, setTransfers] = useState([]);

  useEffect(() =>  {
    async function getHistoryFor() {
      try {
        const logs = await connex.thor
          .filter('event', filters)
          .range({
            unit: "time",
            from: startTimestamp,
            to: endTimestamp
          })
          .order('desc')
          .apply(0, 3);
          console.log(logs)
          const splitHexData = (hexData, numParts) => {
            const cleanHex = hexData.startsWith("0x")
              ? hexData.slice(2)
              : hexData;
  
            const chunkSize = 64; // Each part has 64 characters
            const parts = [];
  
            for (let i = 0; i < numParts; i++) {
              const startIndex = i * chunkSize;
              const endIndex = startIndex + chunkSize;
              const part = cleanHex.substring(startIndex, endIndex);
              parts.push(part);
            }
            return parts;
          };
          const formattedTransfers = await Promise.all(
            logs.map(async (log) => {
              let decodedLog = null;
  
              switch (log.topics[0]) {
                case "0xbb7cf2addc576d161c349efe1848029343caab038bd75e9bed6956bcf1a512de":
                  const [part1, part2, part3] = splitHexData(log.data, 3);
                  decodedLog = {
                    type: "BVM Purchase", // Get the user-friendly name
                    topics: log.topics,
                    data: [part1, part2, part3],
                    meta: log.meta
                  };
                  break;
                case "0xf206e7b297bafe2d31f147e6050538b35b5dd424b658411bd58cfccfdf7b3781":
                  const [part4, part5, part6] = splitHexData(log.data, 3);
  
                  decodedLog = {
                    type: "Vesea Purchase",
                    topics: log.topics,
                    data: [part4, part5, part6],
                    meta: log.meta
                  };
                  break;
  
                case "0x47b97c7cbd7d3ec9d5cc511f0b698f7fe0b891454fc558e49eb656c216b44597":
                  const [part14, part15, part16] = splitHexData(log.data, 3);
                  decodedLog = {
                    type: "Vesea Offer Accepted",
                    topics: log.topics,
                    data: [part14, part15, part16],
                    meta: log.meta
                  };
  
                  break;
                case "0x00c8b66fc64c33296070f8ba0cf8a2cbe11064c2411e231c550ad6c3b9c1499c":
                  const [part17, part18, part19] = splitHexData(log.data, 3);
                  decodedLog = {
                    type: "Vesea Collection Offer Accepted",
                    topics: log.topics,
                    data: [part17, part18, part19],
                    meta: log.meta
                  };
  
                  break;
  
                case "0x92cb176169ade86b7d5c29774fdf7c0ae8d778cacf699d69a479fae9b19681d7":
                  const [part7, part8, part9, part10, part20] = splitHexData(log.data, 5);
                  decodedLog = {
                    type: "WOV Purchase",
                    topics: log.topics,
                    data: [part7, part8, part9, part10, part20],
                    meta: log.meta
                  };
  
                  break;
  
                case "0x7df4fb99994dbf47a019499d198c1ba69e18420edf1d0bc9a31cba5ffa531ef0":
                  const [part11, part12, part13, part21] = splitHexData(log.data, 4);
                  decodedLog = {
                    type: "WOV Offer Accepted",
                    topics: log.topics,
                    data: [part11, part12, part13, part21],
                    meta: log.meta
                  };
  
                  break;
                default:
                  console.log("default case");
                  break;
              }
              console.log(decodedLog);
  
              const getBuyer = (transfer) => {
                switch (transfer.type) {
                  case "BVM Purchase":
                    return "0x" + transfer.topics[2].substring(26);
                  case "Vesea Purchase":
                    return "0x" + transfer.topics[3].substring(26);
                  case "WOV Purchase":
                    return "0x" + transfer.data[0].substring(24);
                  case "WOV Offer Accepted":
                    return "0x" + transfer.data[1].substring(24);
                  case "Vesea Offer Accepted":
                    return "0x" + transfer.data[0].substring(24);
                  case "Vesea Collection Offer Accepted":
                    return "0x" + transfer.data[0].substring(24);
                  default:
                    return "Unknown Buyer";
                }
              };
  
              const getTokenId = (transfer) => {
                switch (transfer.type) {
                  case "BVM Purchase":
                    return parseInt(transfer.data[0], 16);
                  case "Vesea Purchase":
                    return parseInt(transfer.topics[2], 16);
                  case "WOV Purchase":
                    return parseInt(transfer.topics[3], 16);
                  case "WOV Offer Accepted":
                    return parseInt(transfer.topics[3], 16);
                  case "Vesea Offer Accepted":
                    return parseInt(transfer.topics[2], 16);
                  case "Vesea Collection Offer Accepted":
                    return parseInt(transfer.topics[2], 16);
                  default:
                    return "Unknown Token ID";
                }
              };
  
              const getPrice = async (transfer) => {
                let vetAmount;
  
                switch (transfer.type) {
                  case "BVM Purchase":
                  case "Vesea Purchase":
                  case "Vesea Offer Accepted":
                  case "Vesea Collection Offer Accepted":
                    vetAmount = parseInt(transfer.data[1], 16) / Math.pow(10, 18);
                    break;
                  case "WOV Offer Accepted":
                    if (
                      transfer.data[3] ===
                      "00000000000000000000000045429a2255e7248e57fce99e7239aed3f84b7a53"
                    ) {
                      vetAmount = parseInt(transfer.data[2], 16) / 1e18;
                    } else {
                      console.log("yes WOV Offer Accepted");
                      const value = parseInt(transfer.data[2], 16) / 1e18;
                      const amt = value / 10 ** 18;
                      const token = "Ox" + transfer.data[4].substring(24);
                      const blockHeight = transfer.meta.blockNumber;
  
                      vetAmount = await fetchData(blockHeight, token, amt);
                      transfer.vetAmount = vetAmount;
                    }
  
                    break;
                  case "WOV Purchase":
                    if (
                      transfer.data[3] ===
                      "0000000000000000000000000000000000000000000000000000000000000000"
                    ) {
                      vetAmount =
                        parseInt(transfer.data[1], 16) / Math.pow(10, 18);
                    } else {
                      const value = parseInt(transfer.data[1], 16);
                      const amt = value / 10 ** 18;
                      const token = "0x" + transfer.data[4].substring(24);
                      const blockHeight = transfer.meta.blockNumber;
  
                      vetAmount = await fetchData(blockHeight, token, amt);
                      transfer.vetAmount = vetAmount;
                    }
                    break;
                  default:
                    vetAmount = 0;
                }
                return vetAmount + " VET";
              };
  
              const nftAddress = (() => {
                switch (decodedLog.type) {
                  case "WOV Purchase":
                    return "0x" + log.topics[2].substring(26);
                  case "WOV Offer Accepted":
                    return "0x" + log.topics[2].substring(26);
                  case "Vesea Offer Accepted":
                    return "0x" + log.topics[1].substring(26);
                  case "Vesea Purchase":
                    return "0x" + log.topics[1].substring(26);
                  case "Vesea Collection Offer Accepted":
                    return "0x" + log.topics[1].substring(26);
                  default:
                    return "Unknown NFT Address";
                }
              })();
              console.log(nftAddress);
              const buyer = getBuyer(decodedLog);

              const price = await getPrice(decodedLog);
              const tokenId = getTokenId(decodedLog);
              const collectionName = nftCollections[nftAddress];
  
              decodedLog.nftAddress = collectionName;
              decodedLog.buyer = buyer;
              decodedLog.price = price;
              decodedLog.tokenId = tokenId;
  
              return decodedLog;
            })
          );
          setTransfers(formattedTransfers);
          console.log(formattedTransfers);
      } catch (err) {
        console.error(err)
      }
    } getHistoryFor();
  }, [])

  return (
    <>
      <div>
        <h1>Transfers</h1>
        <ul style={{ listStyleType: "none"}}>
          {transfers.map((transfer, index) => (
            <li key={index}
            style={{ border: "1px solid white", display: "inline-blick"}}>
              <p>Type: {transfer.type}</p>
              <p>Collection: {transfer.nftAddress}</p>
              <p>Token ID: {transfer.tokenId}</p>
              <p>Buyer {transfer.buyer}</p>
              <p>Price: {transfer.price}</p>
              <p>
                Time:{" "}
                {new Date(transfer.meta.blockTimestamp * 1000).toLocaleString()}
              </p>
              </li>
              
          ))}

        </ul>
      </div>
    </>
  )
}

