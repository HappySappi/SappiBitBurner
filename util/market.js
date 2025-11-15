/** @param {NS} ns */
export async function main(ns) {

  // "msPerStockUpdate":6000
  // "msPerStockUpdateMin":4000
  // "TicksPerCycle":75
  // "WSEAccountCost":200000000
  // "TIXAPICost":5000000000
  // "MarketData4SCost":1000000000
  // "MarketDataTixApi4SCost":25000000000
  // "StockMarketCommission":100000}
   //stocksymbols "ECP","MGCP","BLD","CLRK","OMTK","FSIG","KGI","FLCM","STM","DCOMM","HLS","VITA","ICRS","UNV","AERO","OMN","SLRS","GPH","NVMD","WDS","LXO","RHOC","APHE","SYSC","CTK","NTLK","OMGA","FNS","JGN","SGC","CTYS","MDYN","TITN"
 // ns.ui.openTail()
     ns.disableLog('getServerMoneyAvailable')
     let config = JSON.parse(ns.read("/jsappi/config.json"));
  while (true) {

    let myMoney = ns.getServerMoneyAvailable("home") * 0.75
    let stockSettings = ns.stock.getConstants()
    let forecastthreshhold = 0.60

    let stocks = ns.stock.getSymbols();
    let stockoption = {}
    for (let i = 1; i < stocks.length; i++) {
      stockoption[i] = {
        forecast: ns.stock.getForecast(stocks[i]),
        havestock: ns.stock.getPosition(stocks[i])[0] != 0,
        maxshares: ns.stock.getMaxShares(stocks[i]),
        maxshareprice: ns.stock.getAskPrice(stocks[i]) * ns.stock.getMaxShares(stocks[i]),
        volatility: ns.stock.getVolatility(stocks[i])

      }

      //buy stocks
      if (stockoption[i].havestock == false && myMoney > stockoption[i].maxshareprice && stockoption[i].forecast > forecastthreshhold && stockoption[i].volatility < 0.015) {
        ns.stock.buyStock(stocks[i], stockoption[i].maxshares)
        myMoney -= stockoption[i].maxshareprice
      }
      
      
      //sell stocks
      if (stockoption[i].havestock == true && stockoption[i].forecast < forecastthreshhold - 0.11) {
        ns.stock.sellStock(stocks[i], stockoption[i].maxshares)
      }
    }
    await ns.stock.nextUpdate();
  }

}