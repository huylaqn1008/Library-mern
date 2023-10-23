import React, { useState } from 'react'
import HistoryRent from '../../components/HistoryRent'
import HistoryBuy from '../../components/HistoryBuy'

const History = () => {
  const [activeTab, setActiveTab] = useState('rent')

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div>
      <h1 className='text-3xl font-semibold text-center my-7'>Payment History</h1>

      <div className="flex justify-center mb-5">
        <button
          className={`mr-3 px-4 py-2 rounded transition-colors duration-250 ${activeTab === 'rent' ? 'bg-gray-200 text-black font-semibold' : 'text-gray-400'
            }`}
          onClick={() => handleTabChange('rent')}
        >
          Rent
        </button>
        <button
          className={`px-4 py-2 rounded transition-colors duration-250 ${activeTab === 'buy' ? 'bg-gray-200 text-black ' : 'text-gray-400'
            }`}
          onClick={() => handleTabChange('buy')}
        >
          Buy
        </button>
      </div>

      {activeTab === 'rent' ? <HistoryRent /> : <HistoryBuy />}
    </div>
  )
}

export default History
