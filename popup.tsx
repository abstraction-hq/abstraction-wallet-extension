import { useEffect, useState } from "react"
import './popup.css';

import { WalletService } from "./services"
import {HLHeader} from "./components/header/HLHeader";

function IndexPopup() {
  const [data, setData] = useState<string>("")

  useEffect(() => {
    const walletService = new WalletService("")
    console.log(walletService.getAddress())
  }, [])

  return (
      <div className="wallet">
          <div className="header">
              <img src="icons/user.png" alt="User Icon" className="user-icon" />
              <span className="username">Paublo</span>
              <img src="icons/notifications.png" alt="Notifications" className="notifications-icon" />
          </div>
          <div className="balance-card">
              <p className="balance-title">My balance</p>
              <p className="balance-amount">$285,410.12</p>
              <div className="balance-actions">
                  <button id="send-btn">Send</button>
                  <button id="receive-btn">Receive</button>
              </div>
          </div>
          <div className="crypto-list">
              <div className="crypto-item">
                  <span className="crypto-name">Ethereum</span>
                  <span className="crypto-amount">$280,193.75</span>
              </div>
              <div className="crypto-item">
                  <span className="crypto-name">Sushiswap</span>
                  <span className="crypto-amount">$2,910.14</span>
              </div>
              <div className="crypto-item">
                  <span className="crypto-name">Polygon</span>
                  <span className="crypto-amount">$1,444.80</span>
              </div>
              <div className="crypto-item">
                  <span className="crypto-name">Tether USD</span>
                  <span className="crypto-amount">$1,012.32</span>
              </div>
              <div className="crypto-item">
                  <span className="crypto-name">Optimism</span>
                  <span className="crypto-amount">$174.87</span>
              </div>
              <div className="crypto-item">
                  <span className="crypto-name">Pancakeswap</span>
                  <span className="crypto-amount">$128.96</span>
              </div>
          </div>
      </div>
  )
}

export default IndexPopup
