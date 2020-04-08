import React, { useState } from 'react';
import { ThemeContext } from './ThemeContext';

export default function CheckBox(attributes) {
    const label = attributes.label || void 0;
    const onCheckStateChanged = attributes.onCheckStateChanged || void 0;
    
    const [checked, setChecked] = useState(false);
    
    return (
        <ThemeContext.Consumer>
            {theme => {
                return (
                    <div id="checkbox-wrapper" className="mb-1">
                        <div id="box-label-grouping" className="flex flex-row justify-start align-middle items-center">
                            <div
                                onClick={() => { 
                                    setChecked(!checked);
                                    onCheckStateChanged(!checked);
                                }}
                                className="w-4 h-4 mr-4 cursor-pointer relative" 
                                style={{ backgroundColor: theme.checkBoxInner, borderRadius: '2.5px', border: '2.5px solid ' + theme.checkBoxOuter, minWidth: '1rem'}}>
                                
                                <span className={`absolute ${!checked ? 'hidden' : 'block'}`} style={{left: '1px', top: '-4px' }}>
                                    <svg width="16" height="16"  fill={theme.svg} viewBox="0 -46 417.813 417" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M159.988 318.582c-3.988 4.012-9.43 6.25-15.082 6.25s-11.094-2.238-15.082-6.25L9.375 198.113c-12.5-12.5-12.5-32.77 0-45.246l15.082-15.086c12.504-12.5 32.75-12.5 45.25 0l75.2 75.203L348.104 9.781c12.504-12.5 32.77-12.5 45.25 0l15.082 15.086c12.5 12.5 12.5 32.766 0 45.246zm0 0"/>
                                    </svg>
                                </span>
                            </div>

                            <span className="block" style={{ color: theme.text }}>{label}</span>
                        </div>
                    </div>
                );
            }}
        </ThemeContext.Consumer>
    );
};