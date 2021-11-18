import moment from "moment";
import { Fund, FundGroup, HistoricalValue } from "../generated/client";

/**
 * Class for test data
 */
class TestData {

  /**
   * Test data for the fund card component
   */
  public static getTestFunds = (): Fund[] => [
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

  /**
   * Generates random number list with given parameters
   *
   * @param length length of the created list
   * @param min min value
   * @param max max value
   * @param multiplier multiplier
   * @returns list of generated numbers
   */
  public static randomNumberList = (length: number, min: number = 1, max: number = 100, multiplier: number = 1) => {
    return [ ...Array(length).keys() ].map((_, i) => Math.floor((Math.random() * (max - min) + min) + i * multiplier));
  };

  /**
   * Gets test data for historical values
   *
   * @param amount of values to generate
   * @returns list of generate HistoricalValue objects
   */
  public static getTestHistoricalValues = (amount: number): HistoricalValue[] => (
    TestData.randomNumberList(amount, 1, 10, 0.5).map((value, i) => ({
      date: moment().subtract(amount - i, "days").toDate(),
      value: value
    }))
  );

}

export default TestData;