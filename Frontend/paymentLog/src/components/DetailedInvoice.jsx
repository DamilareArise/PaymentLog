import React, {useState} from 'react'

const DetailedInvoice = () => {
    const [invoices, setInvoices] = useState([
        { id: "0801", name: "Mustapha Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 200000 },
        { id: "0802", name: "Adamu Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 400000 },
        { id: "0803", name: "Adeniran Abel", paymentInfo: "Cash", amount: 200000, subtotal: 600000 },
        { id: "0804", name: "Joshua John", paymentInfo: "Cash", amount: 200000, subtotal: 800000 },
        { id: "0805", name: "Bamidele John", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 1000000 },
        { id: "0801", name: "Mustapha Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 200000 },
        { id: "0802", name: "Adamu Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 400000 },
        { id: "0803", name: "Adeniran Abel", paymentInfo: "Cash", amount: 200000, subtotal: 600000 },
        { id: "0804", name: "Joshua John", paymentInfo: "Cash", amount: 200000, subtotal: 800000 },
        { id: "0805", name: "Bamidele John", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 1000000 },
        { id: "0801", name: "Mustapha Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 200000 },
        { id: "0802", name: "Adamu Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 400000 },
        { id: "0803", name: "Adeniran Abel", paymentInfo: "Cash", amount: 200000, subtotal: 600000 },
        { id: "0804", name: "Joshua John", paymentInfo: "Cash", amount: 200000, subtotal: 800000 },
        { id: "0805", name: "Bamidele John", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 1000000 },
        { id: "0801", name: "Mustapha Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 200000 },
        { id: "0802", name: "Adamu Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 400000 },
        { id: "0803", name: "Adeniran Abel", paymentInfo: "Cash", amount: 200000, subtotal: 600000 },
        { id: "0804", name: "Joshua John", paymentInfo: "Cash", amount: 200000, subtotal: 800000 },
        { id: "0805", name: "Bamidele John", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 1000000 },
        { id: "0801", name: "Mustapha Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 200000 },
        { id: "0802", name: "Adamu Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 400000 },
        { id: "0803", name: "Adeniran Abel", paymentInfo: "Cash", amount: 200000, subtotal: 600000 },
        { id: "0804", name: "Joshua John", paymentInfo: "Cash", amount: 200000, subtotal: 800000 },
        { id: "0805", name: "Bamidele John", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 1000000 },
        { id: "0801", name: "Mustapha Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 200000 },
        { id: "0802", name: "Adamu Bello", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 400000 },
        { id: "0803", name: "Adeniran Abel", paymentInfo: "Cash", amount: 200000, subtotal: 600000 },
        { id: "0804", name: "Joshua John", paymentInfo: "Cash", amount: 200000, subtotal: 800000 },
        { id: "0805", name: "Bamidele John", paymentInfo: "Bank Transfer", amount: 200000, subtotal: 1000000 },
      ]);
    
      const [isModalOpen, setModalOpen] = useState(false);
      const [newInvoice, setNewInvoice] = useState({ name: "", paymentInfo: "", date: "", amount: "" });
      const totalAmount = invoices.reduce((acc, curr) => acc + curr.amount, 0);
    
      const handleAddInfo = () => setModalOpen(true);
      const handleCloseModal = () => setModalOpen(false);
    
      const handleSave = () => {
        const updatedInvoices = [
          ...invoices,
          {
            id: `080${invoices.length + 1}`,
            name: newInvoice.name,
            paymentInfo: newInvoice.paymentInfo,
            amount: parseInt(newInvoice.amount),
            subtotal: totalAmount + parseInt(newInvoice.amount),
          },
        ];
        setInvoices(updatedInvoices);
        setModalOpen(false);
        setNewInvoice({ name: "", paymentInfo: "", date: "", amount: "" });
      };
    
      return (
        <div className="min-h-screen bg-[#FAF8F8]">
          <header className="relative /flex /justify-between /items-center h-[50px] md:h-[100px] /p-5 bg-[#583820] text-white /rounded-t-lg">
            <div className="absolute left-[-80px] md:left-[-50px] top-[-80px] md:top-[-50px]">
            <div className="circle-outer"><div className="circle"></div></div>
            </div>
          </header>
    
          <section className="pt-[30px] px-[16px] md:px-[50px]">
            <h2 className="text-center md:text-end font-semibold md:mr-[80px] text-xl md:text-3xl mb-[40px]">PAYMENT LOG</h2>
            <div className="flex justify-between">
              <div>
                <h1 className="text-[14px] md:text-[16px] font-[500]">
                  Client: <span className="font-[400] text-[12px] md:text-[14px]"> Company&apos;s Name</span>
                </h1>
                <h2 className="text-[14px] md:text-[16px] font-[500]">
                  Client: <span className="font-[400] text-[12px] md:text-[14px]">Admin&apos;s Name</span>
                </h2>
              </div>
    
              <button
                onClick={handleAddInfo}
                className="bg-[#583820] text-[14px] md:text-xl text-white px-[16px] md:px-[50px] py-[12px] rounded-lg shadow-md"
              >
                Add Info
              </button>
            </div>
          </section>
    
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-5 rounded-lg shadow-lg w-[400px]">
                <h3 className="text-xl font-semibold mb-4 text-center">ADD INFO</h3>
                <input
                  type="text"
                  placeholder="Payer's Name"
                  className="w-full p-2 mb-3 border rounded"
                  value={newInvoice.name}
                  onChange={(e) => setNewInvoice({ ...newInvoice, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Payment Info"
                  className="w-full p-2 mb-3 border rounded"
                  value={newInvoice.paymentInfo}
                  onChange={(e) => setNewInvoice({ ...newInvoice, paymentInfo: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Date"
                  className="w-full p-2 mb-3 border rounded"
                  value={newInvoice.date}
                  onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full p-2 mb-3 border rounded"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                />
                <div className="flex justify-between">
                  <button onClick={handleSave} className="bg-[#583820] text-white px-4 py-2 rounded-lg">
                    Save
                  </button>
                  <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
    
          <p className="text-right text-gray-800 text-[14px] md:text-xl mt-4 px-[16px] md:px-[50px]">Date: 10th October, 2024</p>
    
          
          <section className="bg-white px-[2] md:px-6 rounded-lg shadow-md mt-4 mx-[16px] md:mx-[50px]">
            <table className="w-full text-left mb-4 border-collapse">
              <thead>
                <tr className="/bg-gray-200">
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">S/N</th>
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Payer&apos;s Name</th>
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Payment Info</th>
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Amount</th>
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Sub-total</th>
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Pay ID</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr key={invoice.id} className="/even:bg-gray-100">
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{index + 1}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{invoice.name}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{invoice.paymentInfo}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">${invoice.amount.toLocaleString()}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">${invoice.subtotal.toLocaleString()}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{invoice.id}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className=" ">
                  <td colSpan="4" className="text-right font-[400] p-3 border-t ">
                    <div className="flex justify-end items-center mt-4 gap-[12px]">
                      <button className="bg-[#583820] text-[14px] md:text-lg text-white px-[30px] py-2 rounded-lg shadow-md">Done for term</button>

                      <button className="bg-[#583820] text-[14px] md:text-lg text-white px-[30px] py-2 rounded-lg shadow-md">Print as PDF</button>
                    </div>
                  </td>
                  <td colSpan="2" className="p-3 border-t font-bold border-l-[1px] align-middle">
                    <span className="mr-[35px] text-[14px] font-[500]">Total </span>
                    <span className="text-[14px] font-[500]">${totalAmount.toLocaleString()}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>
    
    
    
          
    
    
          <footer className="flex /justify-between items-center h-[50px] md:h-[100px] /p-5 mt- text-[12px][md:] bg-[#583820] text-white rounded-tl-[100px]">
              <p className="ml-[50px] md:ml-[100px] font-[500] text-[14px] md:text-[18px]">@ Copyright 2024</p>
          </footer>
        </div>
      );
}

export default DetailedInvoice