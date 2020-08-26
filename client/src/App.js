import React, { Component } from "react";
import BFactoryContract from "./contracts/BFactory.json"
import YesContract from "./contracts/Yes.json";
import NoContract from "./contracts/No.json";
import DaiContract from "./contracts/Dai.json";
import getWeb3 from "./getWeb3";
import "./App.css";
const { abi } = require('./contracts/BPool.json');


//App controls the user interface
class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    web3: null,
    accounts: null,
    bfactoryContract: null,
    yesContract: null,
    noContract: null,
    daiContract: null,
    bpoolAddress: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the BFactory contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BFactoryContract.networks[networkId];
      const bfactoryInstance = new web3.eth.Contract(
        BFactoryContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Get Yes contract instance
      const networkId2 = await web3.eth.net.getId();
      const deployedNetwork2 = YesContract.networks[networkId2];
      const yesInstance = new web3.eth.Contract(
        YesContract.abi,
        deployedNetwork2 && deployedNetwork2.address,
      );

      // Get No contract instance
      const networkId3 = await web3.eth.net.getId();
      const deployedNetwork3 = NoContract.networks[networkId3];
      const noInstance = new web3.eth.Contract(
        NoContract.abi,
        deployedNetwork3 && deployedNetwork3.address,
      );

      // Get Dai contract instance
      const networkId4 = await web3.eth.net.getId();
      const deployedNetwork4 = DaiContract.networks[networkId4];
      const daiInstance = new web3.eth.Contract(
        DaiContract.abi,
        deployedNetwork4 && deployedNetwork4.address,
      );

      // Set web3, accounts, and contracts to the state
      this.setState({
        web3,
        accounts,
        bfactoryContract: bfactoryInstance,
        yesContract: yesInstance,
        noContract: noInstance,
        daiContract: daiInstance,
      });

      const { bfactoryContract } = this.state;
      const { noContract } = this.state;
      const { yesContract } = this.state;
      const { daiContract } = this.state;
 

      // @ mint YES, NO and Dai and send to LP1
      await yesContract.methods.mint(accounts[1], web3.utils.toWei('5000')).send({ from: accounts[0] });
      await noContract.methods.mint(accounts[1], web3.utils.toWei('5000')).send({ from: accounts[0] });
      await daiContract.methods.mint(accounts[1], web3.utils.toWei('5000')).send({ from: accounts[0] });

      // @ mint Dai and send to Trader1
      await daiContract.methods.mint(accounts[2], web3.utils.toWei('5000')).send({ from: accounts[0] });

      // create a new balancer pool and save address to state, bind tokens and set public
      const tx = await bfactoryContract.methods.newBPool().send({from: accounts[1], gas: 6000000 });
      var bpoolAddress = tx.events.LOG_NEW_POOL.returnValues[1]
      this.setState({ bpoolAddress: bpoolAddress })
      var pool = new web3.eth.Contract(abi, this.state.bpoolAddress);
      await yesContract.methods.approve(this.state.bpoolAddress, web3.utils.toWei('5000')).send( {from: accounts[1], gas: 6000000 });
      await pool.methods.bind(yesContract.options.address, web3.utils.toWei('5000'), web3.utils.toWei('18.75')).send( {from: accounts[1], gas: 6000000 });
      await noContract.methods.approve(this.state.bpoolAddress, web3.utils.toWei('5000')).send( {from: accounts[1], gas: 6000000 });
      await pool.methods.bind(noContract.options.address, web3.utils.toWei('5000'), web3.utils.toWei('6.25')).send( {from: accounts[1], gas: 6000000 });
      await daiContract.methods.approve(this.state.bpoolAddress, web3.utils.toWei('5000')).send( {from: accounts[1], gas: 6000000 });
      await pool.methods.bind(daiContract.options.address, web3.utils.toWei('5000'), web3.utils.toWei('25')).send( {from: accounts[1], gas: 6000000 });
      await pool.methods.setPublicSwap(true).send( {from: accounts[1], gas: 6000000 });

      // print back end parameters to console.log
      var LP1YesBalance = await yesContract.methods.balanceOf(accounts[1]).call();
      LP1YesBalance = web3.utils.fromWei(LP1YesBalance)
      console.log("LP1 Yes balance: ", LP1YesBalance)

      var LP1NoBalance = await noContract.methods.balanceOf(accounts[1]).call();
      LP1NoBalance = web3.utils.fromWei(LP1NoBalance)
      console.log("LP1 No balance: ", LP1NoBalance)

      var LP1DaiBalance = await daiContract.methods.balanceOf(accounts[1]).call();
      LP1DaiBalance = web3.utils.fromWei(LP1DaiBalance)
      console.log("LP1 Dai balance: ", LP1DaiBalance)

      var Trader1DaiBalance = await daiContract.methods.balanceOf(accounts[2]).call();
      Trader1DaiBalance = web3.utils.fromWei(Trader1DaiBalance);
      console.log("Trader1 Dai balance: ", Trader1DaiBalance);

      var numberOfTokens = await pool.methods.getNumTokens().call();
      console.log("NumberOfTokens: ", numberOfTokens);

      var poolYesBalance = await pool.methods.getBalance(yesContract.options.address).call();
      poolYesBalance = web3.utils.fromWei(poolYesBalance);
      console.log("poolYesBalance: ", poolYesBalance);

      var poolYesNormWeight = await pool.methods.getNormalizedWeight(yesContract.options.address).call();
      poolYesNormWeight = web3.utils.fromWei(poolYesNormWeight);
      console.log("poolYesNormWeight: ", poolYesNormWeight);

      var poolNoBalance = await pool.methods.getBalance(noContract.options.address).call();
      poolNoBalance = web3.utils.fromWei(poolNoBalance);
      console.log("poolNoBalance: ", poolNoBalance);

      var poolNoNormWeight = await pool.methods.getNormalizedWeight(noContract.options.address).call();
      poolNoNormWeight = web3.utils.fromWei(poolNoNormWeight);
      console.log("poolNoNormWeight: ", poolNoNormWeight);

      var poolDaiBalance = await pool.methods.getBalance(daiContract.options.address).call();
      poolDaiBalance = web3.utils.fromWei(poolDaiBalance);
      console.log("poolDaiBalance: ", poolDaiBalance);

      var poolDaiNormWeight = await pool.methods.getNormalizedWeight(daiContract.options.address).call();
      poolDaiNormWeight = web3.utils.fromWei(poolDaiNormWeight);
      console.log("poolDaiNormWeight: ", poolDaiNormWeight);

      var isPublicSwap = await pool.methods.isPublicSwap().call();
      console.log("isPublicSwap: ", isPublicSwap)


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, contract or tokens. Check console for details.`,
      );
      console.error(error);
    }
  };

  // This function updates state in response to user input
  handleChange = async (e) => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e.target.name, ": ", e.target.value);
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        Hello World
      </div>
    );
  };
}

export default App;