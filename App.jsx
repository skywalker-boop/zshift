import React, {useState} from 'react';
import { ethers } from 'ethers';

export default function App(){
  const [addr, setAddr] = useState('');
  const [amt, setAmt] = useState('1000');
  const [log, setLog] = useState('');

  async function connect(){
    if(!window.ethereum) return alert('Install MetaMask');
    const accs = await window.ethereum.request({method:'eth_requestAccounts'});
    setAddr(accs[0]);
  }

  async function sendIntent(){
    if(!addr) return alert('Connect wallet');
    const ts = Math.floor(Date.now()/1000);
    const nonce = Math.random().toString(36).slice(2,10);
    const message = `ZShift intent|to:${addr}|amount:${amt}|ts:${ts}|nonce:${nonce}`;
    try{
      const sig = await window.ethereum.request({method:'personal_sign', params:[message, addr]});
      setLog('Signed intent, sending to relayer...');
      const r = await fetch('http://localhost:3001/intent', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({to:addr, amount:amt, signature:sig, message})
      });
      const j = await r.json();
      setLog('Relayer response: ' + JSON.stringify(j));
    }catch(e){ setLog('Error: '+e.toString()) }
  }

  async function refreshBalance(){
    if(!addr) return;
    const r = await fetch('http://localhost:3001/balance/'+addr);
    const j = await r.json();
    setLog('Balance: ' + (j.balance || '0'));
  }

  return (<div style={{fontFamily:'Inter,Arial',maxWidth:720,margin:'40px auto',padding:20,background:'#0b1220',color:'#fff',borderRadius:12}}>
    <h1>ZShift Demo</h1>
    <p>Frictionless gasless bridge — demo UI</p>
    <button onClick={connect}>Connect Wallet</button>
    <div style={{marginTop:12}}>{addr}</div>
    <div style={{marginTop:12}}>
      <input value={amt} onChange={e=>setAmt(e.target.value)} />
      <button onClick={sendIntent}>Sign Intent & Request Mint</button>
    </div>
    <div style={{marginTop:12}}>
      <button onClick={refreshBalance}>Refresh Balance</button>
    </div>
    <pre style={{marginTop:12,background:'#021024',padding:12,borderRadius:8}}>{log}</pre>
  </div>);
}
