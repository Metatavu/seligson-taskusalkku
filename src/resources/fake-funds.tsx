import { FundGroup } from "../generated/client";
import { Fund } from "../generated/client/models/Fund";

/**
 * Fake data for the fund card component
 */
const fakeFunds: Fund[] = [
  {
    id: "123456788",
    name: {
      fi: "USA Markkina",
      sv: "USA Markkina"
    },
    longName: {
      fi: "USA Markkina",
      sv: "USA Markkina"
    },
    shortName: {
      fi: "USA Markkina",
      sv: "USA Markkina"
    },
    bankReceiverName: "Nordea",
    group: FundGroup.Passive,
    priceDate: new Date("2021-01-01"),
    aShareValue: 18.947,
    bShareValue: 0,
    changeData: {
      change1d: 1,
      change1m: 2,
      change1y: 3,
      change3y: 4,
      change5y: 5,
      change10y: 6,
      change15y: 7,
      change20y: 8
    },
    profitProjection: 10,
    profitProjectionDate: new Date("2021-01-01"),
    color: "#0077b3",
    risk: 6,
    kIID: {
      fi: "",
      sv: ""
    }
  },
  {
    id: "123456789",
    name: {
      fi: "Aasia indeksirahasto",
      sv: "Aasia indeksirahasto"
    },
    longName: {
      fi: "Aasia indeksirahasto",
      sv: "Aasia indeksirahasto"
    },
    shortName: {
      fi: "Aasia indeksirahasto",
      sv: "Aasia indeksirahasto"
    },
    bankReceiverName: "Nordea",
    group: FundGroup.Passive,
    priceDate: new Date("2021-01-01"),
    aShareValue: 18.947,
    bShareValue: 1000,
    changeData: {
      change1d: 1,
      change1m: 2,
      change1y: 3,
      change3y: 4,
      change5y: 5,
      change10y: 6,
      change15y: 7,
      change20y: 8
    },
    profitProjection: 10,
    profitProjectionDate: new Date("2021-01-01"),
    color: "#E76A21",
    risk: 3,
    kIID: {
      fi: "",
      sv: ""
    }
  }
];

export default fakeFunds;