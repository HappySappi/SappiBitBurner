 /** @param {ns} ns **/
 export async function main(ns) {

    //import config file
    config = JSON.parse(ns.args[0]);

    //update # of port openers available
    config.portOpeners.forEach( p => { if (ns.fileExists(p.file, "home")) { config.numOfPortOpenersAvailable++; p.exists = true; } } );

    let myHackLevel = ns.getHackingLevel();



//THESE WILL GO IN LOOPING SCRIPT LATER
//
//FUNCTIONS
//
 /** @param {ns} ns **/
    async function getServers(ns) {
        //This is a quick way to get the list of all servers by starting with home, and adding all scanned servers to a set.
        //Sets only keep unique values, so this will eventually get all servers. This is destructive, as it doesn't preserve the scan path.
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
                money: ns.getServerMoneyAvailable(x),
                maxMoney: ns.getServerMaxMoney(x),                
                hackLevel: ns.getServerRequiredHackingLevel(x),
                numPorts: ns.getServerNumPortsRequired(x),
                hasRoot: ns.hasRootAccess(x),
                isWorker: checkIfWorker(x),
                isTarget: checkIfHackable(x),
                hackTime: ns.getHackTime(x),
                weakenTime: ns.getWeakenTime(x),
                growTime: ns.getGrowTime(x),
                growthRate: ns.getServerGrowth(x),
                
                
            }
        
            if (servers[s].isTarget == true) { scoreServer(servers[s]); }

            //Try to gain root access
            if (servers[s].hasRoot == false){ gainAccess(servers[s]); }
        }
        return servers;
    }


 /** @param {ns} ns **/
    async function checkIfWorker(ns,server) {
        if (ns.getServerMaxRam(server) > 0) {
            return true;
        }
    }
    async function checkIfHackable(ns, server) {
        if (ns.getServerRequiredHackingLevel(server) <= config.hackLevel && ns.getServerMaxMoney(server) > 0 && ns.getServerNumPortsRequired(server) <= config.numOfPortOpenersAvailable) {
            return true;
        }
    }

 /** @param {ns} ns **/
    async function gainAccess(ns, s){
            //Try to gain root access
            if (s.numPorts != 0 && s.numPorts <= config.numOfPortOpenersAvailable) {for (let p = 0; p < s.numPorts; p++) {config.portOpeners[p].action(s.name);}}
            ns.nuke(s.name);
    }
    
    /** @param {ns} ns **/
    async function scoreServer(ns, s){
        
  

    let servers = await getServers(ns);
    let targets = servers.filter( s => s.isTarget == true & s.hackLevel < myHackLevel );
    targets.sort( (a,b) => (b.score) - (a.score) ); //sort by money per hack time
    if (config.isEarlyGame == true) { targets.reverse(); } //prioritize easy targets first in early game
    let workers = servers.filter( s => s.isWorker == true);
    




    

}




 