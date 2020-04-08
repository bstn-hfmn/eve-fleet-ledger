import React, {useState} from 'react';
import { ThemeContext } from './ThemeContext';

export default function HistoryInput(attributes) {
    const onHistoryChanged = attributes.onHistoryChanged || function() {};

    return (
        <ThemeContext.Consumer>
            {theme => {
                return (
                    <div className="flex flex-col w-full mb-12">
                        <div id="history-header-grouping" className="flex flex-row justify-between items-baseline relative">
                            <label className="uppercase text-2xl font-bold mb-4" style={{color: theme.text}}>Loot History</label>
                            <button 
                                className="pr-5 pl-5 pt-1 pb-1 font-black focus:outline-none -mt-20" 
                                style={{backgroundColor: theme.historyOuterBox, borderRadius: '5px 5px 0px 0px', color: theme.text, position: 'relative', top: '1rem'}}>?</button>
                        </div>

                        <div id="history-input-grouping" className="flex flex-row justify-start items-center flex-1">
                            <button
                                onClick={() => {
                                    document.querySelector('#file-dialog').click();
                                }} 
                                className="p-2 focus:outline-none" style={{backgroundColor: theme.historyOuterBox, borderRadius: '5px 0px 0px 5px' }}>
                                <svg height="24px" viewBox="0 -18 512 512" fill={theme.svg} width="24px" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m432 0h-352c-44.113281 0-80 35.886719-80 80v280c0 44.113281 35.886719 80 80 80h273c11.046875 0 20-8.953125 20-20s-8.953125-20-20-20h-73.664062l-45.984376-59.65625 145.722657-185.347656 98.097656 108.421875c5.546875 6.136719 14.300781 8.21875 22.019531 5.246093 7.714844-2.976562 12.808594-10.394531 12.808594-18.664062v-170c0-44.113281-35.886719-80-80-80zm40 198.085938-79.167969-87.503907c-3.953125-4.371093-9.640625-6.785156-15.523437-6.570312-5.886719.207031-11.386719 2.996093-15.03125 7.628906l-154.117188 196.023437-52.320312-67.875c-3.785156-4.910156-9.636719-7.789062-15.839844-7.789062-.003906 0-.007812 0-.011719 0-6.203125.003906-12.058593 2.886719-15.839843 7.804688l-44.015626 57.21875c-6.734374 8.757812-5.097656 21.3125 3.65625 28.046874 8.757813 6.738282 21.3125 5.097657 28.050782-3.65625l28.175781-36.632812 88.816406 115.21875h-148.832031c-22.054688 0-40-17.945312-40-40v-280c0-22.054688 17.945312-40 40-40h352c22.054688 0 40 17.945312 40 40zm0 0"/>
                                    <path d="m140 72c-33.085938 0-60 26.914062-60 60s26.914062 60 60 60 60-26.914062 60-60-26.914062-60-60-60zm0 80c-11.027344 0-20-8.972656-20-20s8.972656-20 20-20 20 8.972656 20 20-8.972656 20-20 20zm0 0"/>
                                    <path d="m468.476562 302.941406c-.058593-.058594-.117187-.121094-.175781-.179687-9.453125-9.519531-22.027343-14.761719-35.410156-14.761719-13.34375 0-25.882813 5.210938-35.324219 14.675781l-38.613281 38.085938c-7.863281 7.753906-7.949219 20.417969-.191406 28.28125 7.753906 7.863281 20.417969 7.953125 28.28125.195312l25.847656-25.492187v112.253906c0 11.046875 8.953125 20 20 20s20-8.953125 20-20v-111.644531l24.738281 25.554687c3.921875 4.054688 9.144532 6.089844 14.371094 6.089844 5.011719 0 10.027344-1.871094 13.910156-5.628906 7.9375-7.683594 8.140625-20.34375.457032-28.28125zm0 0"/>
                                </svg>
                            </button>

                            <input 
                                placeholder="Select file from disk or drag & drop..."
                                readOnly
                                onDrop={(ev) => {
                                    let file = ev.dataTransfer.files[0];
                                    
                                    let reader = new FileReader();
                                    reader.readAsText(file, 'UTF-8');
                                    reader.onload = (e) => {
                                        let content = e.target.result;
                                        onHistoryChanged(content);
                                    };

                                    ev.preventDefault();
                                }}
                                onDragOver={(ev) => {
                                    ev.preventDefault();
                                }}
                                onClick={() => {
                                    document.querySelector('#file-dialog').click();
                                }}
                                type="text" 
                                className="focus:outline-none w-full pl-2 text-white" 
                                style={{height: '40px', border: '5.25px solid ' + theme.historyOuterBox, borderRadius: '0px 0px 5px 0px', backgroundColor: theme.historyInnerBox, color: theme.text}} />
                            
                            <input
                                onChange={(ev) => {
                                    let file = ev.target.files[0];
                                    
                                    let reader = new FileReader();
                                    reader.readAsText(file, 'UTF-8');
                                    reader.onload = (e) => {
                                        let content = e.target.result;
                                        onHistoryChanged(content);
                                    };
                                }}
                                id="file-dialog" type="file" hidden />
                        </div>
                    </div>
                );
            }}
        </ThemeContext.Consumer>
    );
}