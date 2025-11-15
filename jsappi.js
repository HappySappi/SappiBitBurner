 /** @param {NS} ns **/
 export async function main(ns) {
    //INTIALIZATION SCRIPT

    let config = {
        
        homeRamReserve: 0.75,  //Percentage of RAM to reserve on home server
        workPriority: { hack: .80, share: .10, exp: .10 }, //Priority of memory allocation for work done on servers
        mainLoopdelay: 1000, //Delay between main loops in milliseconds
        hackScript: "/jsappi/deploy/hack.js",
        growScript: "/jsappi/deploy/grow.js",
        weakenScript: "/jsappi/deploy/weaken.js",
        nubHackScript: "/jsappi/deploy/nubhack.js",
        shareScript: "/jsappi/deploy/share.js",

        killScript: "/jsappi/util/killlocal.js",
        killAllScript: "/jsappi/util/killall.js",
        buyScript: "/jsappi/util/buyservers.js",
        marketScript: "/jsappi/util/market.js",
        taskManagerScript: "/jsappi/util/tasker.js",
        getServersScript: "/jsappi/util/getservers.js",
        
        
        initializeScript: "/jsappi/jsappi.js",
        loopScript: "/jsappi/mainloop.js",
        hackScriptSize: ns.getScriptRam("/jsappi/deploy/hack.js"),
        growScriptSize: ns.getScriptRam("/jsappi/deploy/grow.js"),
        weakenScriptSize: ns.getScriptRam("/jsappi/deploy/weaken.js"),
        nubHackScriptSize: ns.getScriptRam("/jsappi/deploy/nubhack.js"),
        shareScriptSize: ns.getScriptRam("/jsappi/deploy/share.js"),
        
        isEarlyGame: true,
        portOpeners: [ { file: "BruteSSH.exe", action: ns.brutessh, exists: false }, 
                        { file: "FTPCrack.exe", action: ns.ftpcrack, exists: false }, 
                        { file: "relaySMTP.exe", action: ns.relaysmtp, exists: false }, 
                        { file: "HTTPWorm.exe", action: ns.httpworm, exists: false }, 
                        { file: "SQLInject.exe", action: ns.sqlinject, exists: false } 
                    ],
        marketBuyThreshold: 10000000, //Minimum amount of money before buying stocks
        numOfPortOpenersAvailable: 0,
        allServersAccessible: false,
        reservedHomeRam: 32, //Amount of RAM to keep free on home server for main processes.
        reservedHomeMoney: 0.25, //Percentage of money to keep in home server for purchases.
        }


    
    config.portOpeners.forEach( p => { if (ns.fileExists(p.file, "home")) { config.numOfPortOpenersAvailable++; p.exists = true; } } );
    await ns.write("config.json", JSON.stringify(config), "w");

    

    const prn = ns.print
    ns.ui.openTail()

    prn("Initialization complete.");
    ns.run(config.loopScript);
    await ns.sleep(5000);
    ns.run(config.marketScript);

    }
