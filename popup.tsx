import React from "react"
import { RouterProvider, useNavigate } from 'react-router-dom';
import { routers } from './routers';
import "./style.css"
import "./popup.css"

function IndexPopup() {
  return (
    <RouterProvider router={routers}/>
  )
}

export default IndexPopup
