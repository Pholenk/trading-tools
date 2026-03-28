import { SectorRotationTemplate } from "@/templates";
import MarketData from "@/raw-data/rotation-graph/market.json";
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

export default function Page() {
  const _generateGraphData = () => {
    const marketKeys = Object.keys(MarketData)
    const marketValues = Object.values(MarketData)
    const result = [];

    for (let x = 0; x < marketKeys.length; x++) {
      const newGraphData = {
        symbol: marketKeys[x],
        ...marketValues[x],
        trail: marketValues[x].trail.slice(0, 7)
      }

      result.push(newGraphData)
    }

    return result
  }

  return <SectorRotationTemplate className='py-12 pl-18 pr-13' graph={_generateGraphData()} />
}
