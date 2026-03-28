import { SectorRotationTemplate } from '@/templates'
import MarketData from '@/raw-data/rotation-graph/market.json'
import { RRGDatum } from '@/components/organisms'
// import IDXBASICData from "@/raw-data/rotation-graph/sector-IDXBASIC.json"
// import IDXCYCLICData from "@/raw-data/rotation-graph/sector-IDXCYCLIC.json"
// import IDXENERGYData from "@/raw-data/rotation-graph/sector-IDXENERGY.json"
// import IDXFINANCEData from "@/raw-data/rotation-graph/sector-IDXFINANCE.json"
// import IDXHEALTHData from "@/raw-data/rotation-graph/sector-IDXHEALTH.json"
// import IDXINDUSTData from "@/raw-data/rotation-graph/sector-IDXINDUST.json"
// import IDXINFRAData from "@/raw-data/rotation-graph/sector-IDXINFRA.json"
// import IDXNONCYCData from "@/raw-data/rotation-graph/sector-IDXNONCYC.json"
// import IDXPROPERTData from "@/raw-data/rotation-graph/sector-IDXPROPERT.json"
// import IDXTECHNOData from "@/raw-data/rotation-graph/sector-IDXTECHNO.json"
// import IDXTRANSData from "@/raw-data/rotation-graph/sector-IDXTRANS.json"
// import StockData from "@/raw-data/rotation-graph/stock.json"

type MarketDataKey = keyof typeof MarketData

export default function Page() {
  const indicesToShow: MarketDataKey[] = [
    'COMPOSITE',
    'IDXBASIC',
    'IDXCYCLIC',
    'IDXENERGY',
    'IDXFINANCE',
    'IDXHEALTH',
    'IDXINDUST',
    'IDXINFRA',
    'IDXNONCYC',
    'IDXPROPERT',
    'IDXTECHNO',
    'IDXTRANS',
  ]

  const _marketDataToShow = () => {
    const dataToShow: Record<string, Omit<RRGDatum, 'symbol'>> = {}

    for (let x = 0; x < indicesToShow.length; x++) {
      dataToShow[indicesToShow[x]] = MarketData[indicesToShow[x]]
    }

    return dataToShow
  }
  const _generateGraphData = () => {
    const market = _marketDataToShow()
    const marketKeys = Object.keys(market)
    const marketValues = Object.values(market)
    const result = []

    for (let x = 0; x < marketKeys.length; x++) {
      const newGraphData = {
        symbol: marketKeys[x],
        ...marketValues[x],
        trail: marketValues[x]?.trail?.slice(0, 7),
      }

      result.push(newGraphData)
    }

    return result
  }

  return <SectorRotationTemplate className='py-12 pl-18 pr-13' graph={_generateGraphData()} />
}
