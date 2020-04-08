import CheckBox from './CheckBox';
import React, {useState} from 'react';
import { ThemeContext } from './ThemeContext';

const BUY = 0;
const SELL = 1;

const STATIONS = [
    { name: 'Jita',     id: 30000142 },
    { name: 'Hek',      id: 30002053 },
    { name: 'Rens',     id: 30002510 },
    { name: 'Amarr',    id: 30002187 },
    { name: 'Dodixie',  id: 30002659 }
];

let filters = [
    { active: false, id: 11,     name: 'Ammunition & Charges' },
    { active: false, id: 955,    name: 'Ship and Module Modifications'  },
    { active: false, id: 1659,   name: 'Special Edition Assets'  },
    { active: false, id: 2,      name: 'Blueprints & Reactions'  },
    { active: false, id: 1954,   name: 'Ship Skins'  },
    { active: false, id: 1320,   name: 'Planetary Infrastructure'  },
    { active: false, id: 4,      name: 'Ships'  },
    { active: false, id: 157,    name: 'Drones'  },
    { active: false, id: 19,     name: 'Trade Goods'  },
    { active: false, id: 1396,   name: 'Apparel'  },
    { active: false, id: 475,    name: 'Manufacture & Research'  },
    { active: false, id: 9,      name: 'Ship Equipment'  },
    { active: false, id: 2202,   name: 'Structure Equipment'  },
    { active: false, id: 2203,   name: 'Structure Modifications'  },
    { active: false, id: 1922,   name: 'Pilot Services'  },
    { active: false, id: 24,     name: 'Implants & Boosters'  },
    { active: false, id: 150,    name: 'Skills'  },
    { active: false, id: 477,    name: 'Structures'  },
    { active: false, id: -512,     name: 'Ores'  },
];


export default function Filters(attributes) {
    const onDragged = attributes.onDragged || function() {};
    const onStationChanged = attributes.onStationChanged || function() {};
    const onCategoryFilter = attributes.onCategoryFilter || function() {};
    const onPricingChanged = attributes.onPricingChanged || function() {};
    const onPlayerIgnore = attributes.onPlayerIgnore || function() {};

    console.log(onPlayerIgnore);


    const [folded, setFolded] = useState(false);
    const [station, setStation] = useState(STATIONS[0]);
    const [pricing, setPricing] = useState(BUY);

    const [ignored, setIgnored] = useState([]);

    return (
        <ThemeContext.Consumer>
            {theme => {
                return (
                    <div>
                        <div
                            onClick={() => setFolded(!folded)} 
                            id="filter-header-grouping" 
                            className="mb-4 flex flex-row justify-between items-center cursor-pointer">

                            <label className="uppercase text-2xl font-bold cursor-pointer" style={{color: theme.text}}>Filter</label>

                            {!folded && 
                            <span>
                                <svg fill={theme.svg} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 492.002 492.002">
                                    <path d="M484.136 328.473L264.988 109.329c-5.064-5.064-11.816-7.844-19.172-7.844-7.208 0-13.964 2.78-19.02 7.844L7.852 328.265C2.788 333.333 0 340.089 0 347.297s2.784 13.968 7.852 19.032l16.124 16.124c5.064 5.064 11.824 7.86 19.032 7.86s13.964-2.796 19.032-7.86l183.852-183.852 184.056 184.064c5.064 5.06 11.82 7.852 19.032 7.852 7.208 0 13.96-2.792 19.028-7.852l16.128-16.132c10.488-10.492 10.488-27.568 0-38.06z"/>
                                </svg>
                            </span>
                            }

                            {folded &&
                            <span>
                                <svg fill={theme.svg} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 491.996 491.996">
                                    <path d="M484.132 124.986l-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"/>
                                </svg>
                            </span>
                            }
                        </div>
                        <div className="flex flex-col justify-start">
                            <div id="filter-grouping" className={`${folded ? 'hidden' : 'block'} flex w-full flex-row justify-between items-center`}>
                                <div 
                                    id="filter-selection-grouping" 
                                    className={`${folded ? 'hidden' : 'block'} flex flex-row justify-between`} 
                                    style={{width: '55%', minWidth: '55%', marginRight: '12.5%'}}>
                                    
                                    <div className="mr-6">
                                        {filters.map((value, index) => {
                                            if(index >= 10)
                                                return null;
                                            
                                            const name = (<span className="uppercase font-medium" style={{fontSize: '15px'}}>{value.name}</span>);
                                            return (
                                                <CheckBox key={index} onCheckStateChanged={() => {
                                                    filters[index].active = !filters[index].active;
                                                    onCategoryFilter(filters);
                                                }} label={name} />
                                            );
                                        })}
                                    </div>
                                    <div>
                                        {filters.map((value, index) => {
                                            if(index < 10)
                                                return null;
                                            
                                            const name = (<span className="uppercase font-medium" style={{fontSize: '15px'}}>{value.name}</span>);
                                            return (
                                                <CheckBox key={index} onCheckStateChanged={() => {
                                                    filters[index].active = !filters[index].active;
                                                    onCategoryFilter(filters);
                                                }} label={name} />
                                            );
                                        })}
                                    </div>
                                </div>
                                        
                                <div className="flex flex-col">
                                    <label className="font-medium uppercase mb-2" style={{fontSize: '15px', color: theme.text}}>Ignore</label>

                                    <div 
                                        id="drag-container"
                                        onDragEnter={(ev) => {ev.preventDefault();}}
                                        onDragOver={(ev) => {ev.preventDefault();}}
                                        onDrop={(ev) => {
                                            if(!ev.dataTransfer.items.length > 0)
                                                return;
                                            
                                            ev.dataTransfer.items[0].getAsString((str) => {
                                                ignored.push(str);
                                                
                                                onPlayerIgnore(ignored);
                                                setIgnored([...ignored]);
                                            });
                                        }}
                                        className="relative overflow-y-auto w-full flex flex-col items-center justify-center" style={{width: '300px', height: '300px', borderRadius: '5px', backgroundColor: theme.filterDropInInner, border: `6px dashed ${theme.filterDropInOuter}`}}>
                                        
                                        {ignored.length > 0 &&
                                         ignored.map((value, index) => {
                                             return ( 
                                                <div key={index} className="z-20">
                                                    <span className="z-20 font-medium text-xl" style={{color: theme.text}}>{value}</span>
                                                    <button 
                                                        className="z-20 ml-4 rounded bg-red-500 pl-2 pr-2 text-white"
                                                        onClick={() => {
                                                            ignored.splice(ignored.indexOf(value), 1);
                                                            
                                                            onPlayerIgnore(ignored);
                                                            setIgnored([...ignored]);
                                                        }}
                                                    >X</button>
                                                </div>
                                             );
                                         })
                                        }
                                        <span className="absolute z-10">
                                            <svg width="156" fill={theme.filterDropInOuter} height="156" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M458.667 192H352c-5.888 0-10.667 4.779-10.667 10.667s4.779 10.667 10.667 10.667h106.667c17.643 0 32 14.357 32 32v213.333c0 17.643-14.357 32-32 32H245.333c-17.643 0-32-14.357-32-32v-85.333c0-5.888-4.779-10.667-10.667-10.667S192 367.445 192 373.333v85.333C192 488.064 215.936 512 245.333 512h213.333C488.064 512 512 488.064 512 458.667V245.333C512 215.936 488.064 192 458.667 192zM160 298.667h-10.667c-5.888 0-10.667 4.779-10.667 10.667S143.445 320 149.333 320H160c5.888 0 10.667-4.779 10.667-10.667s-4.779-10.666-10.667-10.666zM62.741 0h-9.408C48.235 0 43.2.725 38.357 2.133c-5.653 1.664-8.896 7.595-7.253 13.248 1.365 4.651 5.632 7.659 10.24 7.659 1.003 0 2.005-.128 3.008-.427a31.745 31.745 0 018.981-1.28h9.408c5.909 0 10.667-4.779 10.667-10.667S68.629 0 62.741 0zM21.333 257.216v-21.568c0-5.888-4.779-10.667-10.667-10.667S0 229.76 0 235.648v21.568c0 5.888 4.779 10.667 10.667 10.667s10.666-4.779 10.666-10.667zM10.667 203.179c5.888 0 10.667-4.779 10.667-10.667v-21.568c0-5.888-4.779-10.667-10.667-10.667S0 165.056 0 170.944v21.568c0 5.888 4.779 10.667 10.667 10.667zM10.667 73.792c5.888 0 10.667-4.779 10.667-10.667v-9.792c0-2.965.405-5.888 1.195-8.704 1.6-5.675-1.685-11.563-7.36-13.163-5.632-1.685-11.563 1.664-13.163 7.36A53.735 53.735 0 000 53.333v9.792c0 5.888 4.779 10.667 10.667 10.667zM10.667 138.496c5.888 0 10.667-4.779 10.667-10.667v-21.568c0-5.888-4.779-10.667-10.667-10.667S0 100.373 0 106.261v21.568c0 5.888 4.779 10.667 10.667 10.667zM44.587 297.451a32.104 32.104 0 01-13.781-8.085c-4.16-4.16-10.923-4.117-15.083.043-4.16 4.181-4.139 10.944.043 15.083a53.268 53.268 0 0022.997 13.483 10.74 10.74 0 002.923.405c4.629 0 8.917-3.051 10.24-7.744 1.621-5.676-1.665-11.585-7.339-13.185zM307.605 51.968c.981 0 1.984-.128 2.987-.448 5.653-1.664 8.917-7.573 7.253-13.227-2.517-8.619-7.253-16.533-13.675-22.891-4.181-4.139-10.944-4.117-15.083.085-4.139 4.181-4.096 10.944.085 15.083 3.84 3.84 6.699 8.576 8.192 13.717a10.683 10.683 0 0010.241 7.681zM256.832 0h-21.568c-5.888 0-10.667 4.779-10.667 10.667s4.779 10.667 10.667 10.667h21.568c5.888 0 10.667-4.779 10.667-10.667S262.72 0 256.832 0zM106.219 298.667H84.651c-5.888 0-10.667 4.779-10.667 10.667S78.763 320 84.651 320h21.568c5.888 0 10.667-4.779 10.667-10.667s-4.779-10.666-10.667-10.666zM309.333 73.6c-5.888 0-10.667 4.779-10.667 10.667v21.568c0 5.888 4.779 10.667 10.667 10.667S320 111.723 320 105.835V84.267c0-5.91-4.779-10.667-10.667-10.667zM192.149 0h-21.568c-5.909 0-10.667 4.779-10.667 10.667s4.779 10.667 10.667 10.667h21.547c5.909 0 10.688-4.779 10.688-10.667S198.037 0 192.149 0zM127.445 0h-21.568C99.989 0 95.21 4.779 95.21 10.667s4.779 10.667 10.667 10.667h21.568c5.888 0 10.667-4.779 10.667-10.667S133.333 0 127.445 0zM309.333 138.667c-5.888 0-10.667 4.779-10.667 10.667V160c0 5.888 4.779 10.667 10.667 10.667S320 165.888 320 160v-10.667c0-5.888-4.779-10.666-10.667-10.666z"/><path d="M349.952 185.515l-33.067-33.067c-12.971-12.971-34.112-12.971-47.083 0a33.135 33.135 0 00-8.171 13.419c-11.627-4.053-25.536-1.045-34.496 7.915-4.885 4.885-7.915 10.923-9.131 17.237-10.176-1.429-20.8 2.027-28.203 9.429-7.083 7.083-10.304 16.576-9.664 25.856a33.12 33.12 0 00-19.029 9.451c-6.293 6.293-9.749 14.656-9.749 23.552s3.456 17.28 9.749 23.552l9.557 9.557v38.251C170.667 360.064 194.603 384 224 384h43.733C331.84 384 384 331.84 384 267.733c0-31.04-12.096-60.245-34.048-82.218zm-82.219 177.152H224c-17.643 0-32-14.357-32-32V313.75l24.469 24.469c4.16 4.16 10.923 4.16 15.083 0a10.716 10.716 0 000-15.104l-55.36-55.36c-2.261-2.24-3.499-5.269-3.499-8.448 0-3.179 1.237-6.187 3.499-8.448 4.523-4.523 12.395-4.523 16.917 0l23.36 23.36c4.16 4.16 10.923 4.16 15.083 0a10.716 10.716 0 003.115-7.552c0-2.731-1.045-5.461-3.115-7.531l-26.667-26.667c-4.672-4.672-4.672-12.245 0-16.917 4.523-4.523 12.395-4.523 16.917 0l16 16c4.16 4.16 10.923 4.16 15.083 0 2.069-2.091 3.115-4.821 3.115-7.552s-1.045-5.461-3.115-7.531l-10.667-10.667c-4.672-4.672-4.672-12.245 0-16.917 4.523-4.523 12.395-4.523 16.917 0l10.667 10.667c4.16 4.16 10.923 4.16 15.083 0 2.069-2.091 3.115-4.821 3.115-7.552s-1.045-5.461-3.136-7.552c-2.261-2.24-3.499-5.248-3.499-8.448s1.259-6.208 3.52-8.448c4.672-4.672 12.245-4.672 16.917 0l33.067 33.067c17.92 17.92 27.797 41.771 27.797 67.115.001 52.351-42.581 94.933-94.933 94.933z"/>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div id="station-price-grouping" className={`${folded ? 'hidden' : 'block'} flex flex-row justify-between mt-8 mb-8`}>
                                <div id="station-grouping" className="flex flex-row">
                                    {STATIONS.map((value, index) => {
                                        return (
                                        <button 
                                            key={index}
                                            className="p-2 pl-6 pr-6 mr-4 uppercase font-medium focus:outline-none"
                                            style={{color: theme.text, borderRadius: '5px', backgroundColor: station.id === value.id ? theme.stationButtonActive : theme.stationButtonDeactive }}
                                            onClick={() => {
                                                setStation(value);
                                                onStationChanged(value);
                                            }}
                                            >
                                            {value.name}
                                        </button>
                                        );
                                    })}
                                </div>

                                <div id="price-grouping" className="flex flex-row">
                                    <button 
                                        className="p-2 pl-4 pr-4 uppercase font-medium focus:outline-none"
                                        style={{backgroundColor: pricing === BUY ? theme.pricingButtonActive : theme.pricingButtonDeactive, color: theme.text, borderRadius: '5px 0px 0px 5px'}}
                                        onClick={() => {
                                            setPricing(BUY);
                                            onPricingChanged(BUY);
                                        }}>Buy
                                    </button>
                                    
                                    <button 
                                        className="p-2 pl-4 pr-4 font-medium uppercase focus:outline-none"
                                        style={{backgroundColor: pricing === SELL ? theme.pricingButtonActive : theme.pricingButtonDeactive, color: theme.text,  borderRadius: '0px 5px 5px 0px' }}
                                        onClick={() => {
                                            setPricing(SELL);
                                            onPricingChanged(SELL);
                                        }}>Sell
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                );
            }}
        </ThemeContext.Consumer>
    );
}