 /** @param {NS} ns **/
 export async function main(ns) {

    //import config file
    let config = JSON.parse(ns.read("/jsappi/config.json"));
    
    //update # of port openers available
    

    let myHackLevel = ns.getHackingLevel();
    

    ns.run(config.buyServersScript); //run buy servers script

//
//FUNCTIONS
//
 
  
//Get list of all servers, their stats, and whether they are workers or targets
    let servers = await getServers(ns);
    let targets = servers.filter( s => s.isTarget == true & s.hackLevel < myHackLevel );
    targets.sort( (a,b) => (b.score) - (a.score) ); //sort by money per hack time
    if (config.isEarlyGame == true) { targets.reverse(); } //prioritize easy targets first in early game
    let workers = servers.filter( s => s.isWorker == true);
    

//Buy 

//Keep the stock market updated

    

}




 