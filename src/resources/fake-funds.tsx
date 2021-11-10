import { FundData, FundType } from "../types";

/**
 * Fake data for the fund card component
 */
const fakeFunds: FundData[] = [
  {
    id: 123456788,
    fundName: "USA Markkina",
    fundType: FundType.PASSIVE,
    lahiTapiola: true,
    priceHistory: {
      oneDay: 10,
      oneMonth: 20,
      oneYear: 30,
      fiveYears: 40,
      twentyYears: 50
    },
    lastUpdated: "2010/01/01",
    riskLevel: 6,
    color: "#0077b3"
  },
  {
    id: 123456788,
    fundName: "Aasia indeksirahasto",
    fundType: FundType.PASSIVE,
    lahiTapiola: false,
    priceHistory: {
      oneDay: 10,
      oneMonth: 20,
      oneYear: 30,
      fiveYears: 40,
      twentyYears: 50
    },
    lastUpdated: "2010/01/01",
    riskLevel: 5,
    color: "#E76A21"
  },
  {
    id: 123456789,
    fundName: "Tropico LatAm",
    fundType: FundType.ACTIVE,
    lahiTapiola: false,
    priceHistory: {
      oneDay: 10,
      oneMonth: 20,
      oneYear: 30,
      fiveYears: 40,
      twentyYears: 50
    },
    lastUpdated: "2010/01/01",
    riskLevel: 7,
    color: "#723A1C"
  },
  {
    id: 123456787,
    fundName: "Euro-obligaatio",
    fundType: FundType.INTEREST,
    lahiTapiola: false,
    priceHistory: {
      oneDay: 10,
      oneMonth: 20,
      oneYear: 30,
      fiveYears: 40,
      twentyYears: 50
    },
    lastUpdated: "2010/01/01",
    riskLevel: 3,
    color: "#261CBE"
  },
  {
    id: 123456786,
    fundName: "Pharos",
    fundType: FundType.COMPINATION,
    lahiTapiola: false,
    priceHistory: {
      oneDay: 10,
      oneMonth: 20,
      oneYear: 30,
      fiveYears: 40,
      twentyYears: 50
    },
    lastUpdated: "2010/01/01",
    riskLevel: 4,
    color: "#7E801A"
  }
];

export default fakeFunds;