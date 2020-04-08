
function getItems() {
  
  const fetcher = async() => {
    
    let result = [];
    const response = await fetch(`https://esi.evetech.net/v1/universe/types/?page=38`);
    const types = await response.json();

    for(let i = 0; i < types.length; i++) {
      console.log(types[i]);
      const current  = types[i];
      try 
      {
        const response = await fetch(`https://esi.evetech.net/v3/universe/types/${current}/`, {
          method: 'GET',
          headers: {
            'Accept-Language': 'en-US',
            'Content-Language': 'en-US'
          }
        });
        
        const json     = await response.json();

        if(json['market_group_id'] !== undefined) {
          let groups = [];

          let current = json['market_group_id'];
          while(current !== undefined && 
                current !== null && 
                current !== void 0) 
          {
            const marketResponse = await fetch(`https://esi.evetech.net/v1/markets/groups/${current}/?language=`, {
              method: 'GET',
              headers: {
                'Accept-Language': 'en-US',
                'Content-Language': 'en-US'
              }
            });
            const marketJson = await marketResponse.json();

            groups.push({
              id: marketJson['market_group_id'],
              name: marketJson['name']
            });

            current = marketJson['parent_group_id'];
          }

          result.push({
            id: json['type_id'],
            name: json['name'],

            groups: groups.reverse()
          });
        }
      } catch { continue; }
    };

    return result;
  };

  fetcher().then((r) => console.log(JSON.stringify(r)));
}
