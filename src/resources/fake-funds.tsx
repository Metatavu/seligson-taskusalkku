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
    priceDate: undefined,
    aShareValue: 18.947,
    bShareValue: 0,
    changeData: {
      _1dChange: 10,
      _1mChange: 20,
      _1yChange: 30,
      _3yChange: 40,
      _5yChange: 50,
      _15yChange: 50,
      _20yChange: 50
    },
    profitProjection: 10,
    profitProjectionDate: undefined,
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
    priceDate: undefined,
    aShareValue: 18.947,
    bShareValue: 1000,
    changeData: {
      _1dChange: 100,
      _1mChange: 200,
      _1yChange: 300,
      _3yChange: 400,
      _5yChange: 500,
      _15yChange: 500,
      _20yChange: 500
    },
    profitProjection: 10,
    profitProjectionDate: undefined,
    color: "#E76A21",
    risk: 3,
    kIID: {
      fi: "",
      sv: ""
    }
  }
];

export default fakeFunds;