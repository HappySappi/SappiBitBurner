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
    ns.run(config.loopScript,1, JSON.stringify(config) );
    }
