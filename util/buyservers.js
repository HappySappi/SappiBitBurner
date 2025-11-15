/** @param {NS} ns **/
    export async function main(ns) {
        let config = JSON.parse(ns.read("/jsappi/config.json"))
        let pStat = []
        let returnMessage = "";
        let pLimit = ns.getPurchasedServerLimit()
        let pServers = ns.getPurchasedServers();
        let pMaxRam = ns.getPurchasedServerMaxRam()

        //check if we need to do anything
        const allMaxed = pServers.every(s => ns.getServerMaxRam(s) === pMaxRam);
         if (pServers.length == pLimit && allMaxed) { return; } //nothing to do}
            
            

        //get list of purchasable servers and costs.
        for (let p = 1; p <= Math.log2(pMaxRam); p++) {pStat[p] = { ram: 2 ** p, cost: ns.getPurchasedServerCost(2 ** p) };}
        let x = ns.getPurchasedServerUpgradeCost()
        
        


        //buy servers if we have the money
        let myMoney = ns.getServerMoneyAvailable("home") * (1 - config.reservedHomeMoney)
        if (pServers.length < pLimit) {
        for (let s = pStat.length - 1; s > 0; s--) {
            if (myMoney > pStat[s].cost) {
                //buy new servers if we have the money and haven't hit the limit
                
                ns.purchaseServer("jsappi-" + Date.now().toString().slice(-4), pStat[s].ram);
                myMoney -= pStat[s].cost;
                pServers = ns.getPurchasedServers(); //update list of purchased servers
                returnMessage += "Purchased server with " + pStat[s].ram + " RAM for " + pStat[s].cost + " money.\n";
                break;
                //only buy once per loop
                
            }
        }
    }
    else if (pServers.length == pLimit) {
        //upgrade servers if we have the money
        upgrading: for (let i = 0; i < pServers.length; i++) {
            let curRam = ns.getServerMaxRam(pServers[i]);
            if (curRam == pMaxRam) { continue; } //skip if already maxed
            for (let s = pStat.length - 1; s > 0; s--) {
                if (pStat[s].ram > curRam && myMoney > pStat[s].cost) {
                    ns.upgradePurchasedServer(pServers[i], pStat[s].ram);
                    myMoney -= pStat[s].cost;
                    returnMessage += "Upgraded server " + pServers[i] + " to " + pStat[s].ram + " RAM for " + pStat[s].cost + " money.\n";
                    break upgrading; //only upgrade once per loop.
                }
            }
        }
    }


    }