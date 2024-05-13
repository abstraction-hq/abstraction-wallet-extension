import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState<string>("")

  return (
    <div
      style={{
        padding: 16,
        width: "357px",
        height: "600px"
      }}>
      <h2>
        Gm duchuyyy
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup
