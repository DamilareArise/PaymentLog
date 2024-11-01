import DetailedInvoice from "./components/DetailedInvoice"
import PaymentInvoice from "./components/PaymentHome"

import { Routes, Route } from "react-router-dom"
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<PaymentInvoice   />} />
        <Route path="/detailedInvoice" element={<DetailedInvoice/>} /> 
        {/* omo that means this will be a dynamic route  */}
      </Routes>
    </>
  )
}

export default App
