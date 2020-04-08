const ITEMS = require('./items.json');

/*
    {
        OUT:
        [{
            name: string,
            
            loot: [ 
                { 
                    id: int, 
                    name: string, 
                    quantity: int, 
                   
                    groups: [...] 
                }
            ]
         }]
    }
*/
function parse(history) {
    let players = [];

    let REGEX = /.*?\t(.*?)\t(.*?)\t(.*?)\t/;
    if(typeof history.split !== 'function') 
        return false;

   const lines = history.split('\n');
   for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if(!line || line === '' || !REGEX.test(line)) 
            continue;
        
        const groups = REGEX.exec(line);

        const name = groups[1];
        const item = groups[2];
        const quantity = parseInt(groups[3]);

        const data = ITEMS.find((e) => e.name === item);
        if(!data)
            continue;
        
        
        let f = {...data};
        f['quantity'] = quantity;
        
        if(typeof name !== 'string' || 
           typeof item !== 'string' || 
           typeof quantity !== 'number')
                continue;

        if(name === "Jericho Daily")
            console.log(quantity);
        
        const playerOccurrenceIndex = players.findIndex((el) => el.name === name);
        if(playerOccurrenceIndex >= 0)
        {
            const items = players[playerOccurrenceIndex].items;
            const itemOccurrenceIndex = items.findIndex((el) => el.name === name);
            if(itemOccurrenceIndex >= 0)
                players[playerOccurrenceIndex].items[itemOccurrenceIndex].quantity += quantity;
            else
                players[playerOccurrenceIndex].items.push(f);

            players[playerOccurrenceIndex].occurrences++;
        }
        else {
            players.push({
                name: name,
                show: false,
                occurrences: 1,
                items: [f]
            })
            
            if(name === 'Jericho Daily')
                console.log(players);
        }
   };

   return players;
}

export { parse };