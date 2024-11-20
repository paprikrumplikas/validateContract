import { useState } from 'react'
import './App.css'
import { useStateContext } from './context/web3Context'

function App() {
  const [startingValue, setStartingValue] = useState('')
  const { deployCounter, address } = useStateContext()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (startingValue === '' || parseInt(startingValue) < 0) return
    try {
      const contractAddress = await deployCounter(parseInt(startingValue))
      console.log('Contract deployed at:', contractAddress)
    } catch (error) {
      console.error('Failed to deploy:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Counter Contract Deployer</h1>

      {!address ? (
        <p className="text-center text-gray-600">Please connect your wallet to continue</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            min="0"
            value={startingValue}
            onChange={(e) => setStartingValue(e.target.value)}
            placeholder="Enter starting value"
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={startingValue === '' || parseInt(startingValue) < 0}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deploy Counter Contract
          </button>
        </form>
      )}
    </div>
  )
}

export default App
