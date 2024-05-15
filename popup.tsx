import { useEffect, useState } from "react"

import { WalletService } from "./services"
import {HLHeader} from "./components/header/HLHeader";

function IndexPopup() {
  const [data, setData] = useState<string>("")

  useEffect(() => {
    const walletService = new WalletService("")
    console.log(walletService.getAddress())
  }, [])

  return (
    <div
      style={{
        padding: 16,
        width: "357px",
        height: "600px"
      }}>
        <HLHeader/>
      {/*<h2>*/}
      {/*  Gm mien*/}
      {/*</h2>*/}
      {/*<input onChange={(e) => setData(e.target.value)} value={data} />*/}
      {/*<a href="https://docs.plasmo.com" target="_blank">*/}
      {/*  View Docs*/}
      {/*</a>*/}
      {/*<div>{data}</div>*/}
    </div>
  )
}

export default IndexPopup
