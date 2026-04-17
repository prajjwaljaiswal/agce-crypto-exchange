import { useState } from 'react'
import { SAMPLE_DEPOSIT_ADDRESS } from '../constants.js'
import { SelectCoinStep } from '../components/SelectCoinStep.js'
import { SelectNetworkStep } from '../components/SelectNetworkStep.js'
import { SelectNetworkModal } from '../components/SelectNetworkModal.js'
import { DepositDetailsCard } from '../components/DepositDetailsCard.js'
import { DepositFaq } from '../components/DepositFaq.js'
import { DepositHistory } from '../components/DepositHistory.js'

export function DepositPage() {
  const [selectedCoin] = useState('USDT')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [depositAddress, setDepositAddress] = useState('')
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)

  const hasGeneratedAddress = Boolean(depositAddress)

  const handleSelectNetwork = (code: string) => {
    setSelectedNetwork(code)
    setDepositAddress('')
    setIsNetworkModalOpen(false)
  }

  const handleGenerateAddress = () => {
    if (!selectedNetwork) return
    setDepositAddress(SAMPLE_DEPOSIT_ADDRESS)
  }

  return (
    <div className="dashboard_right">
      <div className="depositcrypto_lft">
        <div className="deposit_crypto_page_head">
          <h1>Deposit Crypto</h1>
        </div>

        <div className="deposit_crypto_block_coin">
          <div className="deposit_crypto_left">
            <SelectCoinStep selectedCoin={selectedCoin} />

            <SelectNetworkStep
              selectedNetwork={selectedNetwork}
              onOpen={() => setIsNetworkModalOpen(true)}
            />

            <DepositDetailsCard depositAddress={depositAddress} />

            {selectedNetwork ? (
              <>
                <div className="coin_items_select mt-5">
                  <div className="col-sm-6 login_btn">
                    <input
                      type="button"
                      value={hasGeneratedAddress ? 'Transfer Completed' : 'Generate Address'}
                      onClick={hasGeneratedAddress ? undefined : handleGenerateAddress}
                    />
                  </div>
                </div>
                <small className="text-success">
                  Click here once transaction status completed on your end
                </small>
              </>
            ) : null}
          </div>

          <div className="deposit_crypto_right">
            <DepositFaq />
          </div>
        </div>

        <DepositHistory />
      </div>

      <SelectNetworkModal
        open={isNetworkModalOpen}
        selectedNetwork={selectedNetwork}
        onClose={() => setIsNetworkModalOpen(false)}
        onSelect={handleSelectNetwork}
      />
    </div>
  )
}
