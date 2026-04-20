import { useMemo, useState } from 'react'
import { SelectCoinStep } from '../components/SelectCoinStep.js'
import { SelectNetworkStep } from '../components/SelectNetworkStep.js'
import { SelectNetworkModal } from '../components/SelectNetworkModal.js'
import { DepositDetailsCard } from '../components/DepositDetailsCard.js'
import { DepositFaq } from '../components/DepositFaq.js'
import { DepositHistory } from '../components/DepositHistory.js'
import { useAssets, useNetworks, useGenerateDepositAddress } from '../hooks.js'
import type { DepositNetwork, DepositCoin } from '../constants.js'

export function DepositPage() {
  const [selectedCoin, setSelectedCoin] = useState('USDT')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [depositAddress, setDepositAddress] = useState('')
  const [memo, setMemo] = useState<string | null>(null)
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)

  const assetsQuery = useAssets()
  const networksQuery = useNetworks(selectedCoin)
  const generateAddressMutation = useGenerateDepositAddress()
  // const historyQuery = useDepositHistory() // TODO: enable when backend implements GET /deposits

  const hasGeneratedAddress = Boolean(depositAddress)

  const coins: DepositCoin[] = useMemo(() => {
    if (!assetsQuery.data) return []
    return assetsQuery.data.map(asset => ({
      code: asset.assetCode,
      name: asset.name,
      icon: asset.iconUrl,
      balance: '0',
      usdValue: '≈ $0',
    }))
  }, [assetsQuery.data])

  const networks: DepositNetwork[] = useMemo(() => {
    if (!networksQuery.data) return []
    return networksQuery.data.map(n => ({
      code: n.network,
      name: n.networkDisplayName,
      eta: '≈ 3 min',
      minDeposit: n.minDeposit ?? '—',
    }))
  }, [networksQuery.data])

  const selectedNetworkData = useMemo(() => {
    if (!networksQuery.data || !selectedNetwork) return null
    return networksQuery.data.find(n => n.network === selectedNetwork)
  }, [networksQuery.data, selectedNetwork])

  const handleSelectCoin = (code: string) => {
    setSelectedCoin(code)
    setSelectedNetwork('')
    setDepositAddress('')
    setMemo(null)
  }

  const handleSelectNetwork = (code: string) => {
    setSelectedNetwork(code)
    setDepositAddress('')
    setMemo(null)
    setIsNetworkModalOpen(false)
  }

  const handleGenerateAddress = () => {
    if (!selectedNetworkData) return
    generateAddressMutation.mutate(selectedNetworkData.fireblocksAssetId, {
      onSuccess: (response) => {
        setDepositAddress(response.address)
        setMemo(response.tag)
      },
    })
  }

  return (
    <div className="dashboard_right">
      <div className="depositcrypto_lft">
        <div className="deposit_crypto_page_head">
          <h1>Deposit Crypto</h1>
        </div>

        <div className="deposit_crypto_block_coin">
          <div className="deposit_crypto_left">
            <SelectCoinStep
              selectedCoin={selectedCoin}
              coins={coins}
              isLoading={assetsQuery.isLoading}
              onSelect={handleSelectCoin}
            />

            <SelectNetworkStep
              selectedNetwork={selectedNetwork}
              onOpen={() => setIsNetworkModalOpen(true)}
            />

            <DepositDetailsCard depositAddress={depositAddress} memo={memo} />

            {selectedNetwork ? (
              <>
                <div className="coin_items_select mt-5">
                  <div className="col-sm-6 login_btn">
                    <input
                      type="button"
                      value={
                        hasGeneratedAddress
                          ? 'Transfer Completed'
                          : generateAddressMutation.isPending
                            ? 'Generating...'
                            : 'Generate Address'
                      }
                      onClick={hasGeneratedAddress || generateAddressMutation.isPending ? undefined : handleGenerateAddress}
                      disabled={hasGeneratedAddress || generateAddressMutation.isPending}
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

        <DepositHistory deposits={[]} isLoading={false} />
      </div>

      <SelectNetworkModal
        open={isNetworkModalOpen}
        selectedNetwork={selectedNetwork}
        networks={networks}
        isLoading={networksQuery.isLoading}
        onClose={() => setIsNetworkModalOpen(false)}
        onSelect={handleSelectNetwork}
      />
    </div>
  )
}
