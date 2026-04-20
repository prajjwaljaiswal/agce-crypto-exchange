import { useEffect, useMemo, useState } from 'react'
import { SelectCoinStep } from '../components/SelectCoinStep.js'
import { SelectNetworkStep } from '../components/SelectNetworkStep.js'
import { SelectNetworkModal } from '../components/SelectNetworkModal.js'
import { DepositDetailsCard } from '../components/DepositDetailsCard.js'
import { DepositFaq } from '../components/DepositFaq.js'
import { DepositHistory } from '../components/DepositHistory.js'
import { ApiError } from '../../../lib/http.js'
import {
  useAssets,
  useNetworks,
  useGenerateDepositAddress,
  useCustodyOverview,
} from '../hooks.js'
import type { DepositNetwork, DepositCoin } from '../constants.js'

function toAbsoluteAssetIconUrl(iconUrl?: string): string {
  if (!iconUrl) return '/images/tether_icon.png'
  if (/^https?:\/\//i.test(iconUrl)) return iconUrl

  const env = import.meta.env as Record<string, string | undefined>
  const base =
    (env.VITE_MATCHING_API_URL ?? env.VITE_AUTH_API_URL ?? '').replace(/\/+$/, '')

  if (!base) return iconUrl
  const normalizedPath = iconUrl.startsWith('/') ? iconUrl : `/${iconUrl}`
  return `${base}${normalizedPath}`
}

export function DepositPage() {
  const [coinSearch, setCoinSearch] = useState('')
  const [networkSearch, setNetworkSearch] = useState('')
  const [coinSearchQuery, setCoinSearchQuery] = useState('')
  const [networkSearchQuery, setNetworkSearchQuery] = useState('')
  const [selectedCoin, setSelectedCoin] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [depositAddress, setDepositAddress] = useState('')
  const [memo, setMemo] = useState<string | null>(null)
  const [minDeposit, setMinDeposit] = useState<string | undefined>(undefined)
  const [confirmationsRequired, setConfirmationsRequired] = useState<number | undefined>(
    undefined,
  )
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false)

  const allAssetsQuery = useAssets('')
  const assetsSearchQuery = useAssets(coinSearchQuery)
  const networksQuery = useNetworks(selectedCoin, networkSearchQuery)
  const generateAddressMutation = useGenerateDepositAddress()
  const custodyOverviewMutation = useCustodyOverview()
  // const historyQuery = useDepositHistory() // TODO: enable when backend implements GET /deposits

  const hasGeneratedAddress = Boolean(depositAddress)

  const coins: DepositCoin[] = useMemo(() => {
    if (!allAssetsQuery.data) return []
    return allAssetsQuery.data.map(asset => ({
      code: asset.assetCode,
      name: asset.name,
      icon: toAbsoluteAssetIconUrl(asset.iconUrl),
      balance: '0',
      usdValue: '≈ $0',
    }))
  }, [allAssetsQuery.data])

  const searchCoins: DepositCoin[] = useMemo(() => {
    const rows = coinSearchQuery.trim()
      ? (assetsSearchQuery.data ?? [])
      : (allAssetsQuery.data ?? [])
    return rows.map(asset => ({
      code: asset.assetCode,
      name: asset.name,
      icon: toAbsoluteAssetIconUrl(asset.iconUrl),
      balance: '0',
      usdValue: '≈ $0',
    }))
  }, [coinSearchQuery, assetsSearchQuery.data, allAssetsQuery.data])

  const selectedAsset = useMemo(() => {
    if (!allAssetsQuery.data) return null
    return allAssetsQuery.data.find((a) => a.assetCode === selectedCoin) ?? null
  }, [allAssetsQuery.data, selectedCoin])

  useEffect(() => {
    const t = window.setTimeout(() => {
      setCoinSearchQuery(coinSearch.trim())
    }, 300)
    return () => window.clearTimeout(t)
  }, [coinSearch])

  useEffect(() => {
    const t = window.setTimeout(() => {
      setNetworkSearchQuery(networkSearch.trim())
    }, 300)
    return () => window.clearTimeout(t)
  }, [networkSearch])

  useEffect(() => {
    if (!allAssetsQuery.data || allAssetsQuery.data.length === 0) return
    const stillExists = allAssetsQuery.data.some((a) => a.assetCode === selectedCoin)
    if (stillExists) return

    const firstAsset = allAssetsQuery.data[0]
    setSelectedCoin(firstAsset.assetCode)
    setSelectedNetwork('')
    setDepositAddress('')
    setMemo(null)
    setMinDeposit(firstAsset.minDeposit)
    setConfirmationsRequired(undefined)
  }, [allAssetsQuery.data, selectedCoin])

  const networkRows = useMemo(() => {
    const raw = networksQuery.data as unknown
    if (Array.isArray(raw)) return raw
    if (raw && typeof raw === 'object') {
      return Object.values(raw as Record<string, unknown>)
    }
    return []
  }, [networksQuery.data])

  const networks: DepositNetwork[] = useMemo(() => {
    return networkRows.map((row) => {
      const n = row as Record<string, unknown>
      const code =
        (typeof n.network === 'string' && n.network)
        || (typeof n.code === 'string' && n.code)
        || ''
      const name =
        (typeof n.networkDisplayName === 'string' && n.networkDisplayName)
        || (typeof n.name === 'string' && n.name)
        || code
      const minDeposit =
        (typeof n.minDeposit === 'string' && n.minDeposit) || '—'

      return {
      code,
      name,
      eta: '≈ 3 min',
      minDeposit,
      }
    }).filter((n) => Boolean(n.code))
  }, [networkRows])

  const selectedNetworkData = useMemo(() => {
    if (!selectedNetwork) return null
    return networkRows.find((row) => {
      const n = row as Record<string, unknown>
      const code =
        (typeof n.network === 'string' && n.network)
        || (typeof n.code === 'string' && n.code)
      return code === selectedNetwork
    }) as Record<string, unknown> | undefined
  }, [networkRows, selectedNetwork])

  const selectedNetworkView = useMemo(() => {
    return networks.find((n) => n.code === selectedNetwork) ?? null
  }, [networks, selectedNetwork])

  const expectedArrival = useMemo(() => {
    return selectedNetworkView?.eta ?? undefined
  }, [selectedNetworkView])

  const expectedUnlock = useMemo(() => {
    if (typeof confirmationsRequired === 'number') {
      return `${confirmationsRequired} network confirmation${confirmationsRequired === 1 ? '' : 's'}`
    }
    return undefined
  }, [confirmationsRequired])
  const handleRetryAddress = () => {
    if (!selectedNetworkData) return
    const network =
      (typeof selectedNetworkData.network === 'string' && selectedNetworkData.network)
      || (typeof selectedNetworkData.code === 'string' && selectedNetworkData.code)
    if (!network) return
    void upsertAddressForSelection(selectedCoin, network)
  }


  const handleSelectCoin = (code: string) => {
    const nextAsset = allAssetsQuery.data?.find((a) => a.assetCode === code)
    setSelectedCoin(code)
    setSelectedNetwork('')
    setDepositAddress('')
    setMemo(null)
    setNetworkSearch('')
    setNetworkSearchQuery('')
    setMinDeposit(nextAsset?.minDeposit)
    setConfirmationsRequired(undefined)
  }

  const upsertAddressForSelection = async (asset: string, network: string) => {
    let existingAddress: string | null = null
    let existingTag: string | null = null

    try {
      const overview = await custodyOverviewMutation.mutateAsync()
      const match = overview.addresses.find(
        (entry) =>
          entry.asset.toUpperCase() === asset.toUpperCase()
          && entry.network.toUpperCase() === network.toUpperCase(),
      )
      if (match) {
        existingAddress = match.address
        existingTag = match.tag ?? null
      }
    } catch (error) {
      // No vault/address exists yet -> expected first-time flow; continue
      // with deposit address generation. Any non-404 API error should still
      // surface to the UI and stop here.
      if (!(error instanceof ApiError) || error.status !== 404) {
        throw error
      }
    }

    if (existingAddress) {
      setDepositAddress(existingAddress)
      setMemo(existingTag)
      return
    }

    const response = await generateAddressMutation.mutateAsync({ asset, network })
    setDepositAddress(response.address)
    setMemo(response.tag)
    setMinDeposit(selectedAsset?.minDeposit ?? response.minDeposit)
    setConfirmationsRequired(response.confirmationsRequired)
  }

  const handleSelectNetwork = async (code: string) => {
    const selected = networkRows.find((row) => {
      const n = row as Record<string, unknown>
      return (
        (typeof n.network === 'string' && n.network === code)
        || (typeof n.code === 'string' && n.code === code)
      )
    }) as Record<string, unknown> | undefined
    setSelectedNetwork(code)
    setDepositAddress('')
    setMemo(null)
    setIsNetworkModalOpen(false)
    setMinDeposit(selectedAsset?.minDeposit)
    setConfirmationsRequired(
      selected && typeof selected.confirmationsRequired === 'number'
        ? selected.confirmationsRequired
        : undefined,
    )

    if (!selected) return
    const network =
      (typeof selected.network === 'string' && selected.network)
      || (typeof selected.code === 'string' && selected.code)
    if (!network) return
    await upsertAddressForSelection(selectedCoin, network)
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
              searchCoins={searchCoins}
              isLoading={coinSearchQuery ? assetsSearchQuery.isLoading : allAssetsQuery.isLoading}
              coinSearch={coinSearch}
              onCoinSearchChange={setCoinSearch}
              onSelect={handleSelectCoin}
            />

            <SelectNetworkStep
              selectedNetwork={selectedNetwork}
              onOpen={() => setIsNetworkModalOpen(true)}
            />

            <DepositDetailsCard
              depositAddress={depositAddress}
              memo={memo}
              minDeposit={minDeposit}
              confirmationsRequired={confirmationsRequired}
              selectedCoin={selectedCoin}
              expectedArrival={expectedArrival}
              expectedUnlock={expectedUnlock}
            />

            {selectedNetwork ? (
              <>
                <div className="coin_items_select mt-5">
                  <div className="col-sm-6 login_btn">
                    <input
                      type="button"
                      value={
                        hasGeneratedAddress
                          ? 'Transfer Completed'
                          : generateAddressMutation.isPending || custodyOverviewMutation.isPending
                            ? 'Preparing...'
                            : 'Generate Address'
                      }
                      onClick={
                        hasGeneratedAddress || generateAddressMutation.isPending || custodyOverviewMutation.isPending
                          ? undefined
                          : handleRetryAddress
                      }
                      disabled={
                        hasGeneratedAddress
                        || !selectedNetworkData
                        || generateAddressMutation.isPending
                        || custodyOverviewMutation.isPending
                      }
                    />
                  </div>
                </div>
                <small className="text-success">
                  Click here once transaction status completed on your end
                </small>
                {generateAddressMutation.isError ? (
                  <small className="text-danger d-block mt-2">
                    {(generateAddressMutation.error as Error).message}
                  </small>
                ) : null}
                {custodyOverviewMutation.isError ? (
                  <small className="text-danger d-block mt-2">
                    {(custodyOverviewMutation.error as Error).message}
                  </small>
                ) : null}
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
        search={networkSearch}
        onSearchChange={setNetworkSearch}
        onClose={() => {
          setIsNetworkModalOpen(false)
          setNetworkSearch('')
          setNetworkSearchQuery('')
        }}
        onSelect={handleSelectNetwork}
      />
    </div>
  )
}
