import { useEffect, useState } from "react";
import axios from 'axios'
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import HeaderSection from "./HeaderSection";
import { useSelector, useDispatch } from "react-redux";
import { setAllPayment, setTotalAmount } from "../redux/stateSlice";

const PaymentInvoice = () => {
  const dispatch = useDispatch()
  const storeData = useSelector((state) => state)
  let allPayment = storeData.stateReducer.allPayment
  let totalAmount = storeData.stateReducer.totalAmount

  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setloading] = useState(false)
  const [loadPayment, setloadPayment] = useState(false)
  const [schoolType, setSchoolType] = useState('SEC')
  const [paymentType, setPaymentType] = useState('Income');
  const [selectedDate, setselectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format as "YYYY-MM-DD" for the date input
  });


  const handleAddIncome = () => {
    setPaymentType('Income');
    setModalOpen(true);
  }

  const handleAddExpense = () => {
    setPaymentType('Expense');
    setModalOpen(true);
  }

  const handleCloseModal = () => setModalOpen(false);



  useEffect(() => {
    setloadPayment(true)
    axios.get('https://paymentlog.onrender.com/pay/payment-by-date', {
      params: { date: selectedDate, schoolType, type: paymentType }
    })
      .then((response) => {
        let result = response.data.data
        console.log(result);
        dispatch(setAllPayment(result))
        dispatch(setTotalAmount(result.reduce((accumulator, current) => accumulator + current.amount, 0)))
        setloadPayment(false)
      })
      .catch((err) => {
        console.log('Error occured:', err.message)
        alert(err.message)
        setloadPayment(false)
      })

  }, [selectedDate, schoolType, dispatch, paymentType])


  let formik = useFormik({
    initialValues: {
      payer: '',
      amount: '',
      schoolType: 'SEC',
    },
    onSubmit: (values) => {

      const endpoint = paymentType === 'Income' ? 'log-payment' : 'log-expense';
      axios.post(`https://paymentlog.onrender.com/pay/${endpoint}`, values)
        .then((response) => {
          console.log(response.data)
          setloading(false)
          handleCloseModal()
          alert(response.data.message)
          window.location.reload()
        })
        .catch((err) => {
          console.log(err.message)
          setloading(false)
          handleCloseModal()
          alert(err.message)
        })

    },

    validationSchema: Yup.object({
      payer: Yup.string().required("Payer's name required"),
      amount: Yup.string().required("Amount required"),
      schoolType: Yup.string().required("School type required"),
    })


  })




  return (
    <div className="h-screen bg-[#FAF8F8] flex flex-col">
      <HeaderSection />
      <section className="pt-6 md:pt-8 px-[16px] md:px-[50px]">
        <h2 className="text-center font-semibold text-lg md:text-2xl mb-5 md:mb-8 tracking-wide text-[#583820]">PAYMENT LOG</h2>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Company Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 md:px-5 md:py-4">
            <h1 className="text-[13px] md:text-[15px] font-semibold text-[#583820] leading-snug">
              ORE OFE OLUWA SCHOOLS
            </h1>
            <p className="text-[11px] md:text-[13px] text-gray-500 mt-0.5">
              Abebi Area Gbongan, Osun State
            </p>
            <p className="text-[11px] md:text-[13px] text-gray-500 mt-0.5">
              09066099573 &middot; 07030965465
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={handleAddIncome}
              className="flex-1 md:flex-none bg-[#583820] hover:bg-[#6b4528] text-[11px] md:text-base text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl shadow-sm font-medium transition-colors"
            >
              + Add Income
            </button>
            <button
              onClick={handleAddExpense}
              className="flex-1 md:flex-none border-2 border-[#583820] text-[#583820] hover:bg-[#583820] hover:text-white text-[11px] md:text-base px-4 md:px-6 py-2.5 md:py-3 rounded-xl shadow-sm font-medium transition-colors"
            >
              + Add Expense
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[400px]">
            <h3 className="text-xl font-semibold mb-4 text-center">ADD {paymentType.toUpperCase()}</h3>
            <form onSubmit={formik.handleSubmit}>

              <input
                type="text"
                placeholder= {paymentType === 'Income' ? "Payer's Name" : "Title"} 
                className="w-full p-2 mb-3 border rounded"
                name="payer"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                formik.touched.payer && formik.errors.payer ? (
                  <div className="text-red-500 mb-2 text-sm">{formik.errors.payer}</div>
                ) : null
              }
              <select
                className="w-full p-2 mb-3 border rounded"
                name="schoolType"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="SEC">Secondary</option>
                <option value="PRI">Primary</option>
              </select>
              {
                formik.touched.schoolType && formik.errors.schoolType ? (
                  <div className="text-red-500 mb-2 text-sm">{formik.errors.schoolType}</div>
                ) : null
              }

              <input
                type="number"
                placeholder="Amount"
                className="w-full p-2 mb-3 border rounded"
                name="amount"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                formik.touched.amount && formik.errors.amount ? (
                  <div className="text-red-500 mb-2 text-sm">{formik.errors.amount}</div>
                ) : null
              }


              <div className="flex justify-between">
                <button type="submit" className="bg-[#583820] text-white px-4 py-2 rounded-lg" >
                  {loading ? "Please wait.." : "Save"}
                </button>
                <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-4 mx-[16px] md:mx-[50px] bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] md:text-sm text-gray-500 font-medium uppercase tracking-wide">Date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setselectedDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] md:text-sm focus:outline-none focus:ring-2 focus:ring-[#583820]/30 focus:border-[#583820] transition-all"
            />
          </div>

          <div className="w-px h-8 bg-gray-200 hidden md:block" />

          {/* School Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] md:text-sm text-gray-500 font-medium uppercase tracking-wide">School</span>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => {
                  setSchoolType('SEC')
                  formik.setFieldValue('schoolType', 'SEC')
                }}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[11px] md:text-sm font-medium transition-all ${
                  schoolType === 'SEC'
                    ? 'bg-[#583820] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Secondary
              </button>
              <button
                type="button"
                onClick={() => {
                  setSchoolType('PRI')
                  formik.setFieldValue('schoolType', 'PRI')
                }}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[11px] md:text-sm font-medium transition-all ${
                  schoolType === 'PRI'
                    ? 'bg-[#583820] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Primary
              </button>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-200 hidden md:block" />

          {/* Payment Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] md:text-sm text-gray-500 font-medium uppercase tracking-wide">Type</span>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setPaymentType('Income')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[11px] md:text-sm font-medium transition-all ${
                  paymentType === 'Income'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('Expense')}
                className={`px-3 md:px-4 py-1.5 rounded-md text-[11px] md:text-sm font-medium transition-all ${
                  paymentType === 'Expense'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Expense
              </button>
            </div>
          </div>
        </div>
      </div>


      <section className="bg-white px-[2] md:px-6 rounded-lg shadow-md mt-4 mx-[16px] md:mx-[50px] flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left mb-4 border-collapse">
            <thead>
              <tr className="/bg-gray-200">
                <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">S/N</th>
                <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">{paymentType === 'Income' ? "Payer's Name" : "Title"}</th>
                <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Amount</th>
                <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Sub-total</th>
                <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Pay ID</th>
              </tr>
            </thead>
            <tbody>
              {loadPayment ? (
                <tr>
                  <td colSpan="6" className="text-center text-[14px] md:text-[16px] text-gray-500 py-6">
                    Loading...
                  </td>
                </tr>
              ) : allPayment.length > 0 ? (
                allPayment.map((allPayment, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{index + 1}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{allPayment.payer}</td>
                  <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">#{allPayment.amount.toLocaleString()}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">#{allPayment.subTotal.toLocaleString()}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{allPayment.schoolType}-00{allPayment.payId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-[14px] md:text-[16px] text-gray-500 py-6">
                    No payment records found for this date.
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr className=" ">
                <td colSpan="3" className="text-right font-bold p-3 border-t ">
                  <div className="flex justify-end items-start md:items-center mt-4">
                    <button className="bg-[#583820] text-[10px] md:text-lg text-white px-[30px] py-2 rounded-lg shadow-md"><Link to={'/detailedInvoice'}>Done for the term</Link></button>
                  </div>
                </td>
                <td colSpan="2" className="p-3 border-t font-bold border-l-[1px] align-middle">
                  <span className="mr-[35px] text-[14px] font-[500]">Total </span>
                  <span className="text-[14px] font-[500]">#{totalAmount.toLocaleString()}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>




      <footer className="flex /justify-between items-center h-[50px] md:h-[100px] /p-5 mt- text-[12px][md:] bg-[#583820] text-white rounded-tl-[100px]">
        <p className="ml-[50px] md:ml-[100px] font-[500] text-[14px] md:text-[18px]">@ Copyright 2024</p>
      </footer>
    </div>
  );
};

export default PaymentInvoice;
