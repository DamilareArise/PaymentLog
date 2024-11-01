import { useEffect, useState } from "react";
import axios from 'axios'
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import HeaderSection from "./HeaderSection";
import { useSelector, useDispatch } from "react-redux";
import { setAllPayment, setdate, setTotalAmount } from "../redux/stateSlice";

const PaymentInvoice = () => {
  const dispatch = useDispatch()
  const storeData = useSelector((state)=> state)
  let allPayment = storeData.stateReducer.allPayment
  let totalAmount = storeData.stateReducer.totalAmount
  let date = storeData.stateReducer.date

  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setloading] = useState(false)



  const handleAddInfo = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {

    axios.get('https://paymentlog.onrender.com/pay/all-payment')
    .then((response)=>{
      let result = response.data.data
      console.log(result);
      dispatch(setAllPayment(result))
      dispatch(setTotalAmount(result.reduce((accumulator, current) => accumulator + current.amount, 0)))
      
      
    })
    .catch((err )=> {
      console.log('Error occured:', err.message)
    })

  }, [])
  
  let formik = useFormik({
    initialValues: {
      payer: '',
      amount: '',
      paymentInfo: ''
    },
    onSubmit: (values) => {
      setloading(true)
      console.log(values);
      axios.post('https://paymentlog.onrender.com/pay/log-payment', values )
      .then((response)=>{
        console.log(response.data)
        setloading(false)
        handleCloseModal()
        alert(response.data.message)
        window.location.reload()
      })
      .catch((err)=>{
        console.log(err.message)
        setloading(false)
        handleCloseModal()
        alert(err.message)
      })

    },

    validationSchema: Yup.object({
      payer: Yup.string().required("Payer's name required"),
      amount: Yup.string().required("Amount required"),
      paymentInfo: Yup.string().required("Payment Info required")
    })


  })

  function formatDateTime(date) {
    // Date formatting with ordinal suffix
    const options = { month: 'short', year: 'numeric' };
    const day = date.getDate();
    const dayWithSuffix = day + (day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th');
    const datePart = date.toLocaleDateString('en-GB', options);

    // Time formatting
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format

    return `${dayWithSuffix} ${datePart}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }


  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(setdate(formatDateTime(new Date())));
    }, 1000);

    // return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  


  return (
    <div className="min-h-screen bg-[#FAF8F8]">
      <HeaderSection />
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
            <form onSubmit={formik.handleSubmit}>

              <input
                type="text"
                placeholder="Payer's Name"
                className="w-full p-2 mb-3 border rounded"
                name="payer"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                formik.touched.payer && formik.errors.payer ? (
                  <div className="text-red-500 mb-2 text-sm">{formik.errors.payer }</div>
                ): null
              }

              <input
                type="text"
                placeholder="Payment Info"
                className="w-full p-2 mb-3 border rounded"
                name="paymentInfo"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              {
                formik.touched.paymentInfo && formik.errors.paymentInfo ? (
                  <div className="text-red-500 mb-2 text-sm">{formik.errors.paymentInfo }</div>
                ): null
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
                  <div className="text-red-500 mb-2 text-sm">{formik.errors.amount }</div>
                ): null
              }


              <div className="flex justify-between">
                <button type="submit" className="bg-[#583820] text-white px-4 py-2 rounded-lg" >
                  {loading ? "Please wait..":"Save"}
                </button>
                <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p className="text-right text-gray-800 text-[14px] md:text-xl mt-4 px-[16px] md:px-[50px]">{date}</p>

      
      <section className="bg-white px-[2] md:px-6 rounded-lg shadow-md mt-4 mx-[16px] md:mx-[50px]">
        <table className="w-full text-left mb-4 border-collapse">
          <thead>
            <tr className="/bg-gray-200">
              <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">S/N</th>
              <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Payer&apos;s Name</th>
              <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Payment Info</th>
              <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Date & Time</th>
              <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Amount</th>
              <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Sub-total</th>
              <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Pay ID</th>
            </tr>
          </thead>
          { allPayment && allPayment.length > 0? (
            <tbody>
              {allPayment.map((allPayment, index) => (
                <tr key={allPayment._id} className="/even:bg-gray-100">
                  <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{index + 1}</td>
                  <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{allPayment.payer}</td>
                  <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{allPayment.paymentInfo}</td>
                  <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{new Date(allPayment.date).toLocaleDateString()} | {new Date(allPayment.date).toLocaleTimeString()}</td>
                  <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">#{allPayment.amount.toLocaleString()}</td>
                  <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">#{allPayment.subTotal.toLocaleString()}</td>
                  <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">FES-00{allPayment.payId}</td>
                </tr>
              ))}
            </tbody>
          ):
          (
            <tbody>
              <tr>
                <td colSpan="7" className="text-center py-5 text-gray-500">Please wait...</td>
              </tr>
            </tbody>
          )
          }

          <tfoot>
            <tr className=" ">
              <td colSpan="4" className="text-right font-bold p-3 border-t ">
                <div className="flex justify-end items-center mt-4">
                  <button className="bg-[#583820] text-[14px] md:text-l text-white px-[30px] py-2 rounded-lg shadow-md"><Link to={'/detailedInvoice'}>Done for the term</Link></button>
                </div>
              </td>
              <td colSpan="2" className="p-3 border-t font-bold border-l-[1px] align-middle">
                <span className="mr-[35px] text-[14px] font-[500]">Total </span>
                <span className="text-[14px] font-[500]">#{totalAmount.toLocaleString()}</span>
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
};

export default PaymentInvoice;
