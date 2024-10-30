import PaymentInvoice from "./components/PaymentHome"

import { Routes, Route } from "react-router-dom"
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<PaymentInvoice   />} />
      </Routes>
    </>
  )
}

export default App
