import React from "react";
import { View, Image } from "react-native";
import styles from "../../styles/generic/fund-card";
import { Divider, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import theme from "../../theme";
import fundCardStyles from "../../styles/generic/fund-card";

/**
 * Interface describing component properties
 */
 interface Props {
  fundId: number;
}

/**
 * Fake data for the fund card component
 */
const fakeData = [
  {
    id: 123456789,
    fundName: "Aasia indeksirahasto",
    lahiTapiola: false,
    priceHistory: {
      oneDay: 10,
      oneMonth: 20,
      oneYear: 30,
      "fiveyears": 40,
      "twentyyears": 50,
    },
    lastUpdated: "2010/01/01",
    riskLevel: 6,
    color: "#E76A21"
  },
  {
    id: 123456788,
    fundName: "USA Markkinat",
    lahiTapiola: true,
    priceHistory: {
      "oneDay": 10,
      "oneMonth": 20,
      "oneYear": 30,
      "fiveyears": 40,
      "twentyyears": 50,
    },
    lastUpdated: "2010/01/01",
    riskLevel: 6,
    color: "#0077b3"
  },
];

/**
 * Component for a fund card
 *
 * @param props component properties
 */
const FundCard: React.FC<Props> = ({
  fundId
}) => {

  const styles = fundCardStyles(useTheme());

  /**
   * Component for price history
   *
   * @param label price history label
   * @param percentage price history percentage
   * @param lastUpdated last update date on price history
   */
  const PriceHistory = (props: { label: string; percentage: number; lastUpdated:string }) => {
    return (
      <View style={ styles.fundViewColumn }>
        <Text>
          { props.label }
        </Text>
        <Text style={ styles.priceHistoryPercentage } >
          { props.percentage }%
        </Text>
      </View>
    )
  }
  
  /**
   * Risk meter
   */ 
  const RiskMeter = () => {
    return (
      <View style={{
        flex:1,
        flexDirection: "row"
      }}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={ styles.riskMeterOn }
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={ styles.riskMeterOn }
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={ styles.riskMeterOn }
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={ styles.riskMeterOn }
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={ styles.riskMeterOn }
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={ styles.riskMeterOn }
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)']}
          style={ styles.riskMeterOff }
        />
      </View>
    )
  }
  
  /**
   * Component render
   */
  return (
    <View style={styles.fundViewWrapper}>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.5)']}
        style={{ backgroundColor:fakeData[fundId].color, width: "5%", height: "100%" }}
      />
      <View style={styles.fundViewContent}>
        <View style={ styles.fundViewRow }>
            <View style={ styles.fundViewColumn }>
              <View style={{ flexDirection:"row" }}>
                <Text style={ theme.fonts.medium }>
                  { fakeData[fundId].fundName }
                </Text>
                {fakeData[fundId].lahiTapiola ? (
                  <Image 
                    source={require('../../../assets/ltLogo.jpg')}
                    style={ styles.tinyLogo }
                  />
                ) : null}
              </View>
              <View style={ styles.fundViewDateRow }>
                <Icon name="calendar" size={12} color={ fakeData[fundId].color }/>
                <Text style={{ paddingLeft: 5}}>
                  { fakeData[fundId].lastUpdated }
                </Text>
              </View>
            </View>
          <View style={ styles.riskContainer }>
            <RiskMeter/>
            <Text>
              Riskitaso { fakeData[fundId].riskLevel }
            </Text>
          </View>
        </View>
        <Divider/>
        <View style={ styles.fundViewRow }>
          <PriceHistory label={ "1pv" } percentage={ fakeData[fundId].priceHistory.oneDay } lastUpdated= { fakeData[fundId].lastUpdated }/> 
          <PriceHistory label={ "1kk" } percentage={ fakeData[fundId].priceHistory.oneMonth } lastUpdated= { fakeData[fundId].lastUpdated }/> 
          <PriceHistory label={ "1v" } percentage={ fakeData[fundId].priceHistory.oneYear } lastUpdated= { fakeData[fundId].lastUpdated }/> 
          <PriceHistory label={ "5v" } percentage={ fakeData[fundId].priceHistory.fiveyears } lastUpdated= { fakeData[fundId].lastUpdated }/> 
          <PriceHistory label={ "20v" } percentage={ fakeData[fundId].priceHistory.twentyyears } lastUpdated= { fakeData[fundId].lastUpdated }/> 
        </View>
      </View>
    </View>
  );
}

export default FundCard;