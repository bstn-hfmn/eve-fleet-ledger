import React, {useState} from 'react';
import CheckBox from './components/CheckBox';
import HistoryInput from './components/HistoryInput';

import * as TEXT from './data/parser';

import { ThemeContext } from './components/ThemeContext';
import Filters from './components/Filters';

const DARK = 'dark';
const LIGHT = 'light';

const THEMES = {
    light: {
        background: '#FFFFFF',
        text: '#404040',

        themeButtonActive: '#DADADA',
        themeButtonDeactive: '#F1F1F1',

        historyInnerBox: '#F1F1F1',
        historyOuterBox: '#E4E4E4',

        svg: '#404040',
        checkBoxInner: '#F1F1F1',
        checkBoxOuter: '#E4E4E4',

        stationButtonActive: '#F1F1F1',
        stationButtonDeactive: '#DADADA',

        pricingButtonActive: '#F1F1F1',
        pricingButtonDeactive: '#DADADA',

        filterDropInInner: '#F1F1F1',
        filterDropInOuter: '#E4E4E4',

        itemPreviewBackground: '#E4E4E4',
        itemPreviewPercent: '#DADADA',
        ledgerBackground: '#DADADA',

        stroke: '#F1F1F1'
    },

    dark: {
        background: '#404040',
        text: '#FAFAFA',

        themeButtonActive: '#373737',
        themeButtonDeactive: '#292929',

        historyInnerBox: '#383838',
        historyOuterBox: 'rgb(33, 33, 33)',

        svg: '#FAFAFA',
        checkBoxInner: '#383838',
        checkBoxOuter: 'rgb(33, 33, 33)',

        stationButtonActive: '#4D4D4D',
        stationButtonDeactive: '#2F2F2F',

        pricingButtonActive: '#4D4D4D',
        pricingButtonDeactive: '#2F2F2F',

        filterDropInInner: '#383838',
        filterDropInOuter: 'rgb(33, 33, 33)',
        
        ledgerBackground: '#2F2F2F',
        
        itemPreviewBackground: '#2F2F2F',
        itemPreviewPercent: '#4D4D4D',

        stroke: '#373737',
    }
};

const ORES = `Veldspar	Concentrated Veldspar	Dense Veldspar	Stable Veldspar
Scordite Scordite	Condensed Scordite	Massive Scordite	Glossy Scordite
Pyroxeres Pyroxeres	Solid Pyroxeres	Viscous Pyroxeres	Opulent Pyroxeres	
Plagioclase Plagioclase	Azure Plagioclase	Rich Plagioclase	Sparkling Plagioclase	
Omber Omber	Silvery Omber	Golden Omber	Platinoid Omber	
Kernite Kernite	Luminous Kernite	Fiery Kernite	Resplendant Kernite
Jaspet Jaspet	Pure Jaspet	Pristine Jaspet	Immaculate Jaspet
Hemorphite Hemorphite	Vivid Hemorphite	Radiant Hemorphite	Scintillating Hemorphite	
Hedbergite Hedbergite	Vitric Hedbergite	Glazed Hedbergite	Lustrous Hedbergite
Gneiss Gneiss	Iridescent Gneiss	Prismatic Gneiss	Brilliant Gneiss
Dark Ochre Dark Ochre	Onyx Ochre	Obsidian Ochre	Jet Ochre
Spodumain Spodumain	Bright Spodumain	Gleaming Spodumain	Dazzling Spodumain
Crokite Crokite	Sharp Crokite	Crystalline Crokite	Pellucid Crokite
Arkonor Arkonor	Crimson Arkonor	Prime Arkonor	Flawless Arkonor
Bistot Bistot	Triclinic Bistot	Monoclinic Bistot	Cubic Bistot
Mercoxit Mercoxit	Magma Mercoxit	Vitreous Mercoxit Talassonite`;

function getPriceString(loadedPrices, item, percent, flag, itemFilter)
{
  if(!loadedPrices)
    return 'LOADING...';

  if(!item || percent <= 0)
    return '0 ISK';

  let payout = 0;
  if(!itemFilter(item))
    return '0 ISK';
  
  const itemPrice = loadedPrices.find((v) => v.id === item.id);

  let price = 0;
  if(flag === 0)
    price = itemPrice.buy;
  else
    price = itemPrice.sell;

  payout += parseInt(price) * item.quantity;
  return `${parseInt(payout * (percent / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ISK`;
}

function getSumPrice(loadedPrices, items, percent, flag, itemFilter) {
  if(!loadedPrices)
    return 'LOADING...';

  if(!items || items.length <= 0 || percent <= 0)
    return 0;
  
  let payout = 0;
  for(let i = 0; i < items.length; i++) {
    if(!itemFilter(items[i]))
      continue;
    
    const itemPrice = loadedPrices.find((v) => v.id === items[i].id);

    let price = 0;
    if(flag === 0)
      price = itemPrice.buy;
    else
      price = itemPrice.sell;

    payout += parseInt(price) * items[i].quantity;
  };

  return parseInt(payout * (percent / 100));
}

function clamp(v, min, max) {
  if(v<min)
    return min;
  if(v>max)
    return max;
  
  return v;
}

function getPricePercentage(loadedPrices, full, of, flag, percent) {

let c;
const itemPrice = loadedPrices.find((v) => v.id === of.id);
if(flag === 0)
  c= ((itemPrice.buy * of.quantity) * (percent / 100));
else
  c= ((itemPrice.sell * of.quantity) * (percent / 100));

  return clamp(parseInt((c / full) * 100), 2, 100);
}

function App() {
  const [theme, setTheme] = useState(THEMES[DARK]);
  document.body.style.backgroundColor = theme.background;

  const [loadingHistory, setLoadingHistory] = useState(false);
  const [parsedHistory, setParsedHistory] = useState(null);
  const [playerUIState, setPlayerUIState] = useState(null);

  const [categoryFilterFunction, setCategoryFilterFunction] = useState(null);
  const [pricingFunction, setPricingFunction] = useState(null);
  
  const [prices, setPrices] = useState(null);
  const [loadedPrices, setLoadedPrices] = useState(null);

  const [usedItems, setUsedItems] = useState(null);
  const [priceFlag, setPriceFlag] = useState(0);

  const [playerFilterFunction, setPlayerFilterFunction] = useState(null);

  const [pricePercentage, setPricePercentage] = useState(90);
  
  return (
    <ThemeContext.Provider value={theme}>
      <div className="container mx-auto mt-12 antialiased" style={{ fontFamily: 'Maven Pro, sans-serif' }}>
        <div id="header-grouping" className="flex flex-row justify-between items-center mb-12">
          <h1 className="uppercase tracking-tight font-black text-5xl" style={{ color: theme.text }}>Fleet Loot Ledger</h1>

          <div id="theme-changer-grouping">
            <button
              onClick={() => setTheme(THEMES[LIGHT])} 
              className="p-2 focus:outline-none" style={{backgroundColor: theme.themeButtonDeactive, borderRadius: '5px 0px 0px 5px'}}>
              <svg width="24" height="24" fill={theme.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 399.079 399.079">
                <path d="M371.84 100.04a7.242 7.242 0 00-9.9-2.62l-35.36 20.44a7.242 7.242 0 007.28 12.52l35.36-20.44a7.242 7.242 0 002.62-9.9zM369.22 289.18l-35.36-20.44a7.242 7.242 0 00-7.28 12.52l35.36 20.44a7.242 7.242 0 007.28-12.52zM200.099 342.62a7.28 7.28 0 00-7.799 7.799v40.84c-.298 4.01 2.711 7.501 6.721 7.799a7.28 7.28 0 007.799-7.799v-40.84a7.281 7.281 0 00-6.721-7.799zM72.5 117.86L37.14 97.42a7.242 7.242 0 00-7.28 12.52l35.36 20.44a7.242 7.242 0 007.28-12.52zM200.099.02a7.28 7.28 0 00-7.799 7.799v40.84a7.28 7.28 0 007.24 7.24 7.28 7.28 0 007.28-7.28V7.82a7.282 7.282 0 00-6.721-7.8zM130.34 65.22l-20.4-35.36a7.242 7.242 0 00-12.52 7.28l20.4 35.36a7.242 7.242 0 0012.52-7.28zM200.618 134.94a7.183 7.183 0 00-1.078 0c-35.678 0-64.6 28.922-64.6 64.6a7.28 7.28 0 007.28 7.28 7.28 7.28 0 007.24-7.28c-.022-27.636 22.364-50.058 50-50.08h.08c4.01.298 7.501-2.711 7.799-6.721s-2.711-7.502-6.721-7.799zM397.98 198.98a7.28 7.28 0 00-6.721-6.721h-40.84c-4.01-.298-7.501 2.711-7.799 6.721a7.28 7.28 0 007.8 7.799h40.84a7.279 7.279 0 006.72-7.799zM49.738 192.3a7.183 7.183 0 00-1.078 0H7.82a7.28 7.28 0 000 14.52h40.84a7.28 7.28 0 007.799-6.721 7.279 7.279 0 00-6.721-7.799z"/><path d="M199.569 92.7c-59.006-.008-106.846 47.819-106.855 106.825a106.843 106.843 0 0031.305 75.575 106.478 106.478 0 0075.52 31.28c59.006.008 106.847-47.819 106.855-106.825S258.575 92.708 199.569 92.7zm65.25 172.24c-36.053 36.053-94.507 36.053-130.56 0a92.32 92.32 0 01-27.04-65.4 92.001 92.001 0 0127.04-65.28v.12c36.053-36.053 94.507-36.053 130.56 0 36.054 36.053 36.054 94.507 0 130.56zM301.678 361.972l-.019-.032-20.44-35.36a7.242 7.242 0 00-12.52 7.28l20.44 35.36a7.24 7.24 0 009.88 2.64 7.24 7.24 0 002.659-9.888zM299.28 27.24a7.242 7.242 0 00-9.9 2.62l-20.44 35.36a7.24 7.24 0 002.58 9.908l.02.012a7.24 7.24 0 009.901-2.608l.019-.032 20.44-35.36a7.242 7.242 0 00-2.62-9.9zM127.76 323.96a7.242 7.242 0 00-9.9 2.62l-20.44 35.36a7.242 7.242 0 0012.52 7.28l20.44-35.36a7.242 7.242 0 00-2.62-9.9zM75.12 271.32a7.242 7.242 0 00-9.9-2.62l-35.36 20.44a7.242 7.242 0 007.28 12.52l35.36-20.44a7.242 7.242 0 002.62-9.9z"/>
              </svg>
            </button>

            <button
              onClick={() => setTheme(THEMES[DARK])} 
              className="p-2 focus:outline-none" style={{backgroundColor: theme.themeButtonActive, borderRadius: '0px 5px 5px 0px'}}>
              <svg width="24" height="24" fill={theme.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 312.999 312.999">
                <path d="M305.6 178.053c-3.2-.8-6.4 0-9.2 2-10.4 8.8-22.4 16-35.6 20.8-12.4 4.8-26 7.2-40.4 7.2-32.4 0-62-13.2-83.2-34.4-21.2-21.2-34.4-50.8-34.4-83.2 0-13.6 2.4-26.8 6.4-38.8 4.4-12.8 10.8-24.4 19.2-34.4 3.6-4.4 2.8-10.8-1.6-14.4-2.8-2-6-2.8-9.2-2-34 9.2-63.6 29.6-84.8 56.8-20.4 26.8-32.8 60-32.8 96.4 0 43.6 17.6 83.2 46.4 112s68.4 46.4 112 46.4c36.8 0 70.8-12.8 98-34 27.6-21.6 47.6-52.4 56-87.6 2-6-1.2-11.6-6.8-12.8zm-61.2 83.6c-23.2 18.4-52.8 29.6-85.2 29.6-38 0-72.4-15.6-97.2-40.4-24.8-24.8-40.4-59.2-40.4-97.2 0-31.6 10.4-60.4 28.4-83.6 12.4-16 28-29.2 46-38.4-2 4.4-4 8.8-5.6 13.6-5.2 14.4-7.6 29.6-7.6 45.6 0 38 15.6 72.8 40.4 97.6s59.6 40.4 97.6 40.4c16.8 0 32.8-2.8 47.6-8.4 5.2-2 10.4-4 15.2-6.4-9.6 18.4-22.8 34.8-39.2 47.6z"/>
              </svg>
            </button>
          </div>
        </div>

        <HistoryInput
          onHistoryChanged={(history) => {
            const parsed = TEXT.parse(history);
            const fetchPortraitURLs = async (size) => {
              for(let i = 0; i < parsed.length; i++) 
              { 
                const url = `https://esi.evetech.net/latest/search/?categories=character&strict=true&search=${parsed[i].name}`;
                const response = await fetch(url);
                const json = await response.json();

                const id = json['character'][0];
                parsed[i]['portrait'] = `https://images.evetech.net/Character/${id}_${size}.jpg`;
              };
            };
            
            setLoadingHistory(true);
            fetchPortraitURLs(64).then(() => {
              let lookup = {};
              for(let i = 0; i < parsed.length; i++) {
                lookup[parsed[i].name] = { show: false, numShowing: 0 };
              };

              setPlayerUIState(lookup);
              setParsedHistory(parsed);
              setLoadingHistory(false);
            });


            setLoadedPrices(null);
            let items = [];
            for(let i = 0; i < parsed.length; i++) {
              for(let j = 0; j < parsed[i].items.length; j++) {
                if(items.findIndex((v) => v.id === parsed[i].items[j].id) === -1)
                  items.push(parsed[i].items[j]);
              };
            };
            setUsedItems(items);

            const priceFetcher = async() => {
              let prices = [];

              let query = '';
              let sequentialIds = [];
              for(let i = 0; i < items.length; i++) {
                query += `${items[i].id}`;

                sequentialIds.push(items[i].id);
                if(i < items.length - 1)
                  query += ',';
              };

              const response = await fetch(`https://api.evemarketer.com/ec/marketstat/json?typeid=${query}&usesystem=30000142`);
              const json = await response.json();

              for(let i = 0; i < items.length; i++) {

                const current = json.filter((v) => v['buy']['forQuery']['types'][0] === items[i].id)[0]; 
                prices.push({
                  id: items[i].id,
                  name: items[i].name,
                  buy: current['buy']['max'],
                  sell: current['sell']['min']
                });
              };

              return prices;
            };

            priceFetcher().then((prices) => {
              setLoadedPrices(prices);
            });
          }} 
          />
        
        <Filters 
          onPricePercentChange={(v) => {
            if(v.includes(','))
              v = v.replace(',', '.');

            if(v === '')
              setPricePercentage(90);
            else
              setPricePercentage(parseFloat(v));
          }}
          onPlayerIgnore={(ignored) => {

            setPlayerFilterFunction({
              filter: (name) => {
                for(let i = 0; i < ignored.length; i++) {
                  if(ignored[i] === name)
                    return false;
                }

                return true;
              }
            })

          }}
          onCategoryFilter={(filters) => {
            setCategoryFilterFunction({
              filter: (item) => {
                if(!item)
                  return false;

                const active = filters.filter((v) => v.active === true);
                if(active.length <= 0)
                  return true;

                for(let i = 0; i < active.length; i++) {
                  const index = item.groups.findIndex((v) => v.id === active[i].id);
                  if(active[i].id === -512) {
                    if(ORES.includes(item.name))
                      return true;
                    else
                      continue;
                  }

                  if(index < 0)
                    continue;
                  else
                    return true;
                };

                return false;
            }});
          }} 
          onStationChanged={(station) => {
            if(!parsedHistory || loadingHistory || !usedItems)
              return;

            setLoadedPrices(null);
            const priceFetcher = async() => {
              let prices = [];
    
              let query = '';
              for(let i = 0; i < usedItems.length; i++) {
                query += `${usedItems[i].id}`;

                if(i < usedItems.length - 1)
                  query += ',';
              };
              
              const response = await fetch(`https://api.evemarketer.com/ec/marketstat/json?typeid=${query}&usesystem=${station.id}`);
              const json = await response.json();
              
              
              for(let i = 0; i < usedItems.length; i++) {
                const current = json.filter((v) => v['buy']['forQuery']['types'][0] === usedItems[i].id)[0]; 
                prices.push({
                  id: usedItems[i].id,
                  name: usedItems[i].name,
                  buy: current['buy']['max'],
                  sell: current['sell']['min']
                });
              };

              
              return prices;
            };

            
            priceFetcher().then((prices) => {
              
              if(station.name === 'Hek')
                console.log(prices);
              setLoadedPrices(prices);
            });
          }}
          onDragged={() => console.log()} 
          onPricingChanged={(flag) => {
            setPriceFlag(flag);
          }}
          />
        

        <div id="stroke" className="w-full block bg-red-500 mt-2 mb-8" style={{height: '3.5px', backgroundColor: theme.stroke}}></div>
        
        
        <div 
          id="ledger-wrapper"
          className={`relative flex flex-col mb-2 justify-start ${!parsedHistory ? 'mt-12' : 'p-4 rounded mt-16'}`}
          style={{backgroundColor: parsedHistory ? theme.ledgerBackground : ''}}
          >
            {parsedHistory &&  
            <div id="copy" className="cursor-pointer absolute p-2 bg-blue-400 flex flex-row justify-center items-center top-0" style={{
              width: '60px',
              alignSelf: 'center',
              borderTopLeftRadius: '30px',
              borderTopRightRadius: '30px',
              top: '-36px',
              backgroundColor: theme.ledgerBackground
            }}
            onClick={() => {
              if(!loadedPrices)
                return;

              let str = '';
              parsedHistory.forEach((player) => {
                if(playerFilterFunction) {
                  if(!playerFilterFunction.filter(player.name))
                    return;
                }

                str += `${player.name}\t${getSumPrice(loadedPrices, player.items, pricePercentage, priceFlag, categoryFilterFunction ? categoryFilterFunction.filter : function() { return true }).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n`;
              });

              navigator.clipboard.writeText(str);
            }}>
              <svg fill={theme.svg} height="28" viewBox="-21 0 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="M410.668 405.332H165.332c-32.363 0-58.664-26.3-58.664-58.664v-288c0-32.363 26.3-58.668 58.664-58.668h181.504c21.059 0 41.687 8.535 56.555 23.445l42.496 42.496c15.125 15.125 23.445 35.223 23.445 56.575v224.152c0 32.363-26.3 58.664-58.664 58.664zM165.332 32c-14.7 0-26.664 11.969-26.664 26.668v288c0 14.7 11.965 26.664 26.664 26.664h245.336c14.7 0 26.664-11.965 26.664-26.664V122.516c0-12.82-4.992-24.871-14.059-33.942l-42.496-42.496C371.84 37.121 359.488 32 346.836 32zm0 0"/><path d="M314.668 512h-256C26.305 512 0 485.695 0 453.332V112c0-32.363 26.305-58.668 58.668-58.668h10.664c8.832 0 16 7.168 16 16s-7.168 16-16 16H58.668C43.968 85.332 32 97.301 32 112v341.332C32 468.032 43.969 480 58.668 480h256c14.7 0 26.664-11.969 26.664-26.668v-10.664c0-8.832 7.168-16 16-16s16 7.168 16 16v10.664c0 32.363-26.3 58.668-58.664 58.668zm0 0M368 181.332H208c-8.832 0-16-7.168-16-16s7.168-16 16-16h160c8.832 0 16 7.168 16 16s-7.168 16-16 16zm0 0"/><path d="M368 245.332H208c-8.832 0-16-7.168-16-16s7.168-16 16-16h160c8.832 0 16 7.168 16 16s-7.168 16-16 16zm0 0M368 309.332H208c-8.832 0-16-7.168-16-16s7.168-16 16-16h160c8.832 0 16 7.168 16 16s-7.168 16-16 16zm0 0"/>
              </svg>
            </div>
            }
        {parsedHistory && !loadingHistory &&
         parsedHistory.map((value, index) => {
          let p = 0;
          if(loadedPrices)
          {
              p = getSumPrice(
                    loadedPrices,
                    value.items, 
                    pricePercentage, 
                    priceFlag, categoryFilterFunction ? categoryFilterFunction.filter : function() { return true; })
          }
          
          if(playerFilterFunction !== null && playerFilterFunction.filter) {
            if(!playerFilterFunction.filter(value.name))
              return null;
          }

          return (
            <div
              key={index}
              onClick={() => {
                let state = playerUIState;
                state[value.name].show = !state[value.name].show;

                setPlayerUIState({...state});
              }} 
              draggable="true"
              onDragStart={(ev) => {
                ev.dataTransfer.effectAllowed = 'move';
                ev.dataTransfer.setData('text/plain', value.name);
              }}
              id="ledger-card-grouping" 
              className="mb-6 p-4 relative cursor-pointer" 
              style={{ backgroundColor: theme.historyInnerBox, borderRadius: '5px 5px 0px 0px' }}>
              
                <div id="inner-card-grouping" className="flex flex-row justify-between items-center mb-2">
                  <div className="flex flex-row justify-start items-center flex-1">
                    <span 
                      className="block self-start" 
                      style={{ width: '55px', height: '55px', borderRadius: '5px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${value.portrait})`}}>

                    </span>

                    <div id="char-info-grouping" className="flex flex-col justify-start items-baseline ml-4 flex-1">
                      <div className="flex flex-row justify-between w-full items-center">
                        <span className="font-medium text-xl" style={{color: theme.text}}>{value.name}</span>
                        <span className="font-medium text-xl relative" style={{color: theme.text }}>{!loadedPrices ? 'LOADING...' : `${p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ISK`}</span>
                      </div>

                      <span className="font-medium text-xs mb-6" style={{color: '#BABABA'}}>{value.occurrences} occurrence(s) | <span className="font-medium">{value.items.filter(categoryFilterFunction ? categoryFilterFunction.filter : function() { return true; }).length}</span> showing</span>

                      <div id="dropdown-grouping" className={`${playerUIState[value.name].show ? 'flex' : 'hidden'} flex-col w-full mb-10`}>
                        
                        {value.items.filter(categoryFilterFunction ? categoryFilterFunction.filter : function() { return true; }).length <= 0 &&
                          <span className="font-medium uppercase text-xl" style={{color: theme.text}}>No Items matching filter</span>
                        }

                        {value.items.map((item, index) => {
                          if(categoryFilterFunction !== null) {
                            if(!categoryFilterFunction.filter(item))
                              return null;
                            else
                              playerUIState[value.name].numShowing++;
                          }

                          return (
                          <div 
                            key={index}
                            id="item-grouping" 
                            className="flex flex-row justify-between items-center flex-1 bg-red-500 p-2 mb-3 relative"
                            style={{borderRadius: '5px', backgroundColor: theme.itemPreviewBackground}}>
                              
                            <span className="font-medium" style={{color: theme.text, zIndex: 1}}>{item.name}<span className="text-xs" style={{color: '#BABABA'}}> x {item.quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span></span>
                            <span className="font-medium" style={{color: theme.text, zIndex: 1}}>{!loadedPrices ? 'LOADING...' : getPriceString(loadedPrices, item, pricePercentage, priceFlag, categoryFilterFunction ? categoryFilterFunction.filter : function() { return true; })}</span>

                            <div id="item-percent" className="absolute h-full" style={{width: !loadedPrices ? '0%' : `${getPricePercentage(loadedPrices, p, item, priceFlag, pricePercentage)}%`, borderRadius: '5px 0px 0px 5px', zIndex: 0, backgroundColor: theme.itemPreviewPercent, left: 0}}></div>
                          
                          </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
 
                </div>

                <div 
                  className="w-full absolute" 
                  style={{height: '5px', right: '0', top: '100%', backgroundColor: theme.historyOuterBox, borderRadius: '0px 0px 5px 5px' }}>
                </div>

                <div 
                  className="w-10 h-8 bg-red-500 absolute flex flex-row items-center justify-center"
                  style={{borderRadius: '5px 0px 0px 0px', right: '0', backgroundColor: theme.historyOuterBox, bottom: '0'}}>
                    
                    <svg width="22" height="22" fill={theme.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.18 512.18">
                      <path d="M448.18 80h-320c-17.673 0-32 14.327-32 32s14.327 32 32 32h320c17.673 0 32-14.327 32-32s-14.327-32-32-32zM64.18 112a32.004 32.004 0 00-9.44-22.56c-12.481-12.407-32.639-12.407-45.12 0A31.996 31.996 0 00.18 112a27.243 27.243 0 000 6.24 28.851 28.851 0 001.76 6.08 37.139 37.139 0 003.04 5.44 29.275 29.275 0 004 4.96 28.322 28.322 0 004.8 3.84 26.073 26.073 0 005.44 3.04 26.412 26.412 0 006.72 2.4 28.06 28.06 0 006.24 0 31.999 31.999 0 0022.56-9.28 29.275 29.275 0 004-4.96 37.139 37.139 0 003.04-5.44 29.714 29.714 0 002.4-6.08 27.243 27.243 0 000-6.24zM64.18 256a27.356 27.356 0 000-6.24 25.927 25.927 0 00-2.4-5.92 31.985 31.985 0 00-3.04-5.6 23.044 23.044 0 00-4-4.8c-12.481-12.407-32.639-12.407-45.12 0A31.996 31.996 0 00.18 256a35.512 35.512 0 002.4 12.32 35.802 35.802 0 002.88 5.44 30.727 30.727 0 004.16 4.8 23.363 23.363 0 004.8 4 25.958 25.958 0 005.44 3.04 27.212 27.212 0 006.08 1.76c2.047.459 4.142.674 6.24.64 2.073.239 4.167.239 6.24 0a25.968 25.968 0 005.92-1.76 26.72 26.72 0 005.6-3.04 23.363 23.363 0 004.8-4 23.363 23.363 0 004-4.8 25.73 25.73 0 003.04-5.44 27.07 27.07 0 002.4-6.72 26.473 26.473 0 000-6.24zM64.18 400a27.471 27.471 0 000-6.24 27.238 27.238 0 00-2.4-6.08 37.139 37.139 0 00-3.04-5.44 23.363 23.363 0 00-4-4.8c-12.481-12.407-32.639-12.407-45.12 0a23.363 23.363 0 00-4 4.8 37.139 37.139 0 00-3.04 5.44 26.224 26.224 0 00-1.76 6.08A27.499 27.499 0 00.18 400a32.004 32.004 0 009.44 22.56 23.363 23.363 0 004.8 4 25.958 25.958 0 005.44 3.04 27.212 27.212 0 006.08 1.76c2.047.459 4.142.674 6.24.64 2.073.239 4.167.239 6.24 0a25.968 25.968 0 005.92-1.76 26.72 26.72 0 005.6-3.04 23.363 23.363 0 004.8-4 23.363 23.363 0 004-4.8 25.617 25.617 0 003.04-5.44 27.164 27.164 0 002.4-6.72 26.473 26.473 0 000-6.24zM480.18 224h-352c-17.673 0-32 14.327-32 32s14.327 32 32 32h352c17.673 0 32-14.327 32-32s-14.327-32-32-32zM336.18 368h-208c-17.673 0-32 14.327-32 32 0 17.673 14.327 32 32 32h208c17.673 0 32-14.327 32-32 0-17.673-14.327-32-32-32z"/>
                    </svg>
                </div>
            </div>
          );
        })}
        </div>

        {!parsedHistory && loadingHistory &&
          <span className="uppercase text-xl font-bold" style={{color: theme.text}}>
            Loading...
          </span>
          }

        {!parsedHistory && !loadingHistory &&
        <span className="uppercase text-xl font-bold" style={{color: theme.text}}>
          Select History file...
        </span>
        }

      </div>
    </ThemeContext.Provider>
  );

};

export default App;
