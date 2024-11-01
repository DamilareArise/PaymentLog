import React, {useState} from 'react'
import arrow from './../assets/arrow.svg'
import HeaderSection from './HeaderSection';
import { useSelector, useDispatch } from "react-redux";
import { Link } from 'react-router-dom';

const DetailedInvoice = () => {
  const storeData = useSelector((state)=> state)
  let allPayment = storeData.stateReducer.allPayment
  let totalAmount = storeData.stateReducer.totalAmount
  let date = storeData.stateReducer.date

      return (
        <div className="min-h-screen bg-[#FAF8F8]">
          <HeaderSection/>

    
          <p className="text-right text-gray-800 text-[14px] md:text-xl mt-4 px-[16px] md:px-[50px]">{date}</p>
    
          
          <section className="bg-white px-[2] md:px-6 rounded-lg shadow-md mt-4 mx-[16px] md:mx-[50px]">
            <table className="w-full text-left mb-4 border-collapse">
              <thead>
                <tr className="/bg-gray-200">
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">S/N</th>
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Payer&apos;s Name</th>
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Amount</th>
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Sub-total</th>
                  <th className="px-[4px] md:px-3 border-t py-5 border-b text-[10px] md:text-[16px] font-[500]">Pay ID</th>
                </tr>
              </thead>
              <tbody>
                {allPayment && allPayment.length > 0 ? allPayment.map((invoice, index) => (
                  <tr key={invoice._id} className="/even:bg-gray-100">
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{index + 1}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{invoice.payer}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">${invoice.amount.toLocaleString()}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">${invoice.subTotal.toLocaleString()}</td>
                    <td className="px-[4px] md:px-3 py-5 border-b text-[10px] md:text-[14px] font-[400]">{invoice.payId}</td>
                  </tr>
                ))
                : <tr>
                    <td colSpan="7" className="text-center py-5 text-gray-500">Please wait...</td>
                  </tr>
                }
              </tbody>
              <tfoot>
                <tr className=" ">
                  <td colSpan="4" className="text-right font-[400] p-3 border-t ">
                    <div className="flex justify-end items-center mt-4 gap-[12px]">
                      <Link to={'/'} className="bg-[#583820] text-[9px] md:text-lg text-white px-[10px] py-2 rounded-lg shadow-md">Back</Link>

                      <button className="bg-[#583820] text-[9px] md:text-lg text-white px-[10px] py-2 rounded-lg shadow-md">Print as PDF</button>
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
        {/* <div className='flex justify-end items-center gap-[10px] font-bold py-[10px] px-[16px] md:px-[50px]'>
            <img src={arrow} alt="" />
            <span className='px-[14px] py-[10px] rounded-[8px] bg-[#845649] text-white text-[16px]'>1</span>
            <img src={arrow} alt="" className='rotate-[180deg]'/>
        </div> */}
    
    
          
    
    
          <footer className="flex /justify-between items-center h-[50px] md:h-[100px] /p-5 mt- text-[12px][md:] bg-[#583820] text-white rounded-tl-[100px]">
              <p className="ml-[50px] md:ml-[100px] font-[500] text-[14px] md:text-[18px]">@ Copyright 2024</p>
          </footer>
        </div>
      );
}

export default DetailedInvoice