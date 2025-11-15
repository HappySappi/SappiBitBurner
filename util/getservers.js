/** @param {NS} ns **/
    export async function main(ns) {
        //This is a quick way to get the list of all servers by starting with home, and adding all scanned servers to a set.
        //Sets only keep unique values, so this will eventually get all servers. This is destructive, as it doesn't preserve the scan path.
      let config = JSON.parse(ns.read("/jsappi/config.json"));
      let serversScanned = new Set(["home"]);
      let servers = [{}]
      serversScanned.forEach(h => { ns.scan(h).forEach(n => serversScanned.add(n)); });
        let list = Array.from(serversScanned);
        for (let s = 0; s < list.length; s++) {
            const x = list[s]; //list of server names
            servers[s] = {
                
                name: ns.getServerHostName(x),
                maxRam: ns.getServerMaxRam(x),
                usedRam: ns.getServerUsedRam(x),
                minSecurity: ns.getServerMinSecurityLevel(x),
                curSecurity: ns.getServerSecurityLevel(x),
                scriptsRunning: ns.ps(x),
                hackTime: ns.getHackTime(x),
                weakenTime: ns.getWeakenTime(x),
                growTime: ns.getGrowTime(x),
                growthRate: ns.getServerGrowth(x),
                money: ns.getServerMoneyAvailable(x),
                maxMoney: ns.getServerMaxMoney(x),                
                hackLevel: ns.getServerRequiredHackingLevel(x),
                numPorts: ns.getServerNumPortsRequired(x),
                hasRoot: ns.hasRootAccess(x),
                isWorker: await checkIfWorker(x),
                isTarget: await checkIfHackable(x),
                
            }
            
            if (servers[s].isTarget == true) { scoreServer(servers[s]); }

            //Try to gain root access
            if (servers[s].hasRoot == false && servers[s].numPorts <= config.numOfPortOpenersAvailable){ gainAccess(servers[s]); }
        }
        return servers;
    

//Any server that has some RAM and root access is a worker
 /** @param {NS} ns **/
    async function checkIfWorker(server) {
        if (ns.getServerMaxRam(server) > 0 && ns.hasRootAccess(server)==true) {
            return true; } else { return false; }

    }
//Any server that can be hacked based on hack level, money, and ports required is a target.
 /** @param {NS} ns **/
    async function checkIfHackable(server) {
        if (ns.getServerRequiredHackingLevel(server) <= config.hackLevel && ns.getServerMaxMoney(server) > 0 && ns.getServerNumPortsRequired(server) <= config.numOfPortOpenersAvailable) {
            return true; } else { return false; }
    }
//Compares the number of ports required to open with the number of port opener .exe programs available. Uses them in order if we have enough, and then nukes the server.
 /** @param {NS} ns **/
    async function gainAccess(s){
            if (s.numPorts != 0) {for (let p = 0; p < s.numPorts; p++) {config.portOpeners[p].action(s.name);}}
            ns.nuke(s.name);
            ns.scp([config.hackScript, config.growScript, config.weakenScript, config.growScript, config.shareScript], "home", s.name);
    }
//Scores a server based on money available and hack time.
    /** @param {NS} ns **/
    async function scoreServer(s){
        s.score = (s.money / s.hackTime);
        

    }
        
}