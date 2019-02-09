import React from 'react';
import { Image,StatusBar,StyleSheet,Text,TextInput,ScrollView,View,Platform,Button,TouchableOpacity,Alert } from 'react-native';
import { LinearGradient } from 'expo';

var activeCoinWalletText = "EGEM";
var activeCoinBalanceDisplay = 0;

var activeNumberWallets = [];
var firstWallet = {coin:"none chosen",balance:0};
activeNumberWallets.push(firstWallet);
function sendCoin(coin){
  Alert.alert("want to send some "+coin+" do you?");
}
async function fetchBlock() {
  try {
    let response = await fetch('http://149.28.32.186:9090/rpc', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "getBalance":{
            "address":"0x7357589f8e367c2C31F51242fB77B350A11830F3"
          }
      })
    });
    await response.json().then((result)=>{
      console.log(result)
      var balanceObject = JSON.stringify(result);
      var balanceReturn = JSON.stringify(JSON.parse(balanceObject)["getBalance"]["balancereturn"]);
      activeNumberWallets = [];
      for(bals in JSON.parse(balanceReturn)){
        var thisOne = JSON.stringify(JSON.parse(balanceReturn)[bals]);
        //Alert.alert("balance "+JSON.stringify(JSON.parse(balanceReturn)[bals])+Object.keys(JSON.parse(thisOne))+Object.values(JSON.parse(thisOne)));
        activeCoinWalletText = Object.keys(JSON.parse(thisOne));
        activeCoinBalanceDisplay = Object.values(JSON.parse(thisOne));
        var firstWallet = {coin:activeCoinWalletText,balance:activeCoinBalanceDisplay};
        activeNumberWallets.push(firstWallet);
      }
      //Alert.alert("return call "+JSON.stringify(JSON.parse(balanceObject)["getBalance"]["balancereturn"]));
    });
    /****


    console.log("well my return is: "+JSON.stringify(JSON.parse(responseJson)));
    *****/
  } catch (error) {
    Alert.alert(error);
    console.error("error is "+error);
  }
}

class CoinWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNumberWallets2: activeNumberWallets
    };
    setInterval(() => (
      this.setState({activeNumberWallets2: activeNumberWallets})
    ), 1000);
  }
  render() {
    this.state.activeNumberWallets2 = activeNumberWallets;
    const items = this.state.activeNumberWallets2.map(function(item){
      return <TouchableOpacity onPress={() => {
        sendCoin(item.coin);
      }} key={[item.coin,'send']}>
      <Text style={styles.text} key={item.coin}>
        <Text style={styles.walletcoin}>{item.coin} </Text>:
        <Text style={styles.coinbalance}> {item.balance}</Text> 👉</Text>
      </TouchableOpacity>;
    });
    return (
        <View style={{alignItems: 'center'}}>
          {items}
          <Text>Available Balances for {this.props.name}!</Text>
        </View>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <LinearGradient style={styles.container} colors={['#20BDFF','#89216B']}>
        <Text>EtherGem Sapphire Network Exchange (SFRX)</Text>
        <View style={styles.card}>
          <View style={{flexDirection:'row'}}>
            <Image style={{margin:10,width:30,height:30,marginTop:20,marginLeft:15}} source={require('./assets/140x140.png')} />
            <Text style={{marginTop:20,fontSize:18}}>EGEM SFRX Reactive 1.0.0</Text>
          </View>
          <View style={{margin:20,width:150,alignItems:"center",color:'#5433FF'}}>
            <TouchableOpacity>
              <Button
                color="#5433FF"
                type="outline"
                onPress={() => {
                  fetchBlock();
                }}
                title="Load Balances"
              />
            </TouchableOpacity>
          </View>
          <CoinWallet name='Frank' />
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    flex: 1,
    width: 300,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 50,
    marginBottom: 50,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50,50,50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 5
      }
    })
  },
  walletcoin: {
    color: '#5433FF',
    fontWeight: '500',
    fontSize: 18,
    marginVertical: 5,
  },
  coinbalance: {
    color: '#94b8b8',
    fontWeight: '500',
    fontSize: 18,
    marginVertical: 5,
  },
});
