import React from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './popup.css';

import CryptoDetail from "~pages/CryptoDetail/CryptoDetail";

import avatar from './assets/images/avatar.png';
import scan from './assets/images/scan.png';
import notification from './assets/images/notification.png';
import arrow_up from './assets/images/arrow_up.png';
import arrow_down from './assets/images/arrow_down.png';
import ethereum from './assets/images/ethereum.png';
import sushiswap from './assets/images/sushiswap.png';
import polygon from './assets/images/polygon.png';
import tether from './assets/images/tether.png';
import optimism from './assets/images/optimism.png';
import pancakeswap from './assets/images/pancakeswap.png';

const dataCrypto = [
  {
      name: "Ethereum",
      symbol: "ETH",
      amount: "$280,193.75",
      quantity: "161.53",
      uri: ethereum
  },
  {
      name: "Sushiswap",
      symbol: "SUSHI",
      amount: "$2,910.14",
      quantity: "1,966.30",
      uri: sushiswap
  },
  {
      name: "Polygon",
      symbol: "MATIC",
      amount: "$1,444.80",
      quantity: "1,007.29",
      uri: polygon
  },
  {
      name: "Tether USD",
      symbol: "USDT",
      amount: "$1,012.32",
      quantity: "1,012.32",
      uri: tether
  },
  {
      name: "Optimism",
      symbol: "OP",
      amount: "$174.87",
      quantity: "102.55",
      uri: optimism
  },
  {
      name: "Pancakeswap",
      symbol: "CAKE",
      amount: "$128.96",
      quantity: "30.11",
      uri: pancakeswap
  }
];

const Popup = () => (
    <div className="wallet">
        <div className="header">
            <img src={avatar} alt="User Icon" className="user-icon" />
            <span className="username">Albert P</span>
            <div>
                <img src={scan} alt="Scan" className="scan-icon" />
                <img src={notification} alt="Notification" className="notifications-icon" />
            </div>
        </div>
        <div className="balance-card">
            <p className="balance-title">My balance</p>
            <span className="balance-currency">$</span>
            <span className="balance-amount">285,410.12</span>
            <div className="balance-actions">
                <button id="send-btn">
                    <img src={arrow_up} alt="Send" />Send</button>
                <button id="receive-btn">
                    <img src={arrow_down} alt="Receive" />Receive</button>
            </div>
        </div>
        {/*<div className="crypto-list">*/}
        {/*    {dataCrypto.map((item, index) => (*/}
        {/*        <Link to={`/crypto/${item.symbol}`} key={index} className="crypto-item">*/}
        {/*            <div className="crypto-info">*/}
        {/*                <img src={item.uri} alt={item.name} className="crypto-icon" />*/}
        {/*                <div className="crypto-details">*/}
        {/*                    <span className="crypto-name">{item.name}</span>*/}
        {/*                    <span className="crypto-symbol">{item.symbol}</span>*/}
        {/*                </div>*/}
        {/*            </div>*/}
        {/*            <div className="crypto-pricing">*/}
        {/*                <span className="crypto-amount">{item.amount}</span>*/}
        {/*                <span className="crypto-quantity">{item.quantity}</span>*/}
        {/*            </div>*/}
        {/*        </Link>*/}
        {/*    ))}*/}
        {/*</div>*/}
    </div>
);

export default Popup;
