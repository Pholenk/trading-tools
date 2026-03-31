import { SectorRotationTemplate } from '@/templates'
import { MARKET_DATA } from '@/raw-data/rotation-graph/Market'
import { type RRGDatum } from '@/organisms'
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

const INDICES_TO_SHOW = [
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

function generateGraphData(): RRGDatum[] {
  return INDICES_TO_SHOW.filter((key) => key in MARKET_DATA).map((key) => ({
    symbol: key,
    ...MARKET_DATA[key],
    trail: MARKET_DATA[key]?.trail?.slice(0, 7),
  }))
}

export default function Page() {
  return <SectorRotationTemplate className='py-12 pl-18 pr-13' graph={generateGraphData()} />
}
