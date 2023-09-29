export const ABIVeSeaGetProfile = {
    inputs: [
      {
        internalType: "address",
        name: "profileAddress",
        type: "address"
      }
    ],
    name: "getProfile",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "profileAddress",
            type: "address"
          },
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "bool",
            name: "blacklisted",
            type: "bool"
          },
          {
            internalType: "bool",
            name: "verified",
            type: "bool"
          },
          {
            internalType: "bool",
            name: "payWithVSea",
            type: "bool"
          },
          {
            internalType: "uint256",
            name: "profileTypeId",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "pfpContract",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "pfpTokenId",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "blockCreated",
            type: "uint256"
          }
        ],
        internalType: "struct VeSeaProfiles.Profile",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  };
  
  export const ABIWoVGetAccountProperties = {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "getAccountPropertiesByAddress",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      },
      {
        internalType: "string",
        name: "",
        type: "string"
      },
      {
        internalType: "string",
        name: "",
        type: "string"
      },
      {
        internalType: "string",
        name: "",
        type: "string"
      },
      {
        internalType: "bool",
        name: "",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  };
  
  export const ABIEnergyGetNicknameFor = {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      }
    ],
    name: "getNicknameFor",
    outputs: [
      {
        internalType: "string",
        name: "nickname",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  };
  