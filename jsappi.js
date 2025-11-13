 /** @param {ns} ns **/
 export async function main(ns) {
    //INTIALIZATION SCRIPT

    let config = {

        homeRamReserve: 0.75,  //Percentage of RAM to reserve on home server
        workPriority: { hack: .80, share: .10, exp: .10 }, //Priority of memory allocation for work done on servers
        mainLoopdelay: 1000, //Delay between main loops in milliseconds
        hackScript: "//jsappi/deploy/hack.js",
        growScript: "//jsappi/deploy/grow.js",
        weakenScript: "//jsappi/deploy/weaken.js",
        nubHackScript: "//jsappi/deploy/nubhack.js",
        shareScript: "//jsappi/deploy/share.js",
        killScript: "//jsappi/util/killlocal.js",
        killAllScript: "//jsappi/util/killall.js",
        buyScript: "//jsappi/util/buyservers.js",
        marketScript: "//jsappi/util/market.js",
        taskManagerScript: "//jsappi/util/taskmanager.js",
        initializeScript: "//jsappi/jsappi.js",
        loopScript: "//jsappi/loop/mainloop.js",
        hackScriptSize: ns.getScriptRam("//jsappi/deploy/hack.js"),
        growScriptSize: ns.getScriptRam("//jsappi/deploy/grow.js"),
        weakenScriptSize: ns.getScriptRam("//jsappi/deploy/weaken.js"),
        nubHackScriptSize: ns.getScriptRam("//jsappi/deploy/nubhack.js"),
        shareScriptSize: ns.getScriptRam("//jsappi/deploy/share.js"),

        isEarlyGame: true,
        portOpeners: [ { file: "BruteSSH.exe", action: ns.brutessh, exists: false }, 
                        { file: "FTPCrack.exe", action: ns.ftpcrack, exists: false }, 
                        { file: "relaySMTP.exe", action: ns.relaysmtp, exists: false }, 
                        { file: "HTTPWorm.exe", action: ns.httpworm, exists: false }, 
                        { file: "SQLInject.exe", action: ns.sqlinject, exists: false } 
                    ],
        numOfPortOpenersAvailable: 0,
        allServersAccessible: false,
        }


    
    
    const prn = ns.print
    ns.ui.openTail()

    prn("Initialization complete.");
    ns.run(config.loopScript);


    config.portOpeners.forEach( p => { if (ns.fileExists(p.file, "home")) { config.numOfPortOpenersAvailable++; p.exists = true; } } );

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
    
  


let targets = servers.filter( s => s.isTarget == true);
let workers = servers.filter( s => s.isWorker == true);




    let servers = await getServers(ns);
    if (allServersAccessible == false) {gainAccess(servers);}

}

