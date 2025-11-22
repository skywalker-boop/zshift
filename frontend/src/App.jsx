import React, {useState} from 'react';
import {ethers} from 'ethers';

export default function App(){
  const [address, setAddress] = useState(null);
  const [amount, setAmount] = useState('');
  const [fromChain, setFromChain] = useState('base');
  const [toChain, setToChain] = useState('arbitrum');
  const [status, setStatus] = useState('');

  async function connect(){
    if(!window.ethereum) return alert('Install MetaMask');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    setAddress(await signer.getAddress());
  }

  async function submit(){
    if(!address) return alert('Connect wallet');
    if(!amount || isNaN(Number(amount))) return alert('Invalid amount');
    setStatus('Sending request to relayer...');

    try{
      const resp = await fetch((import.meta.env.VITE_RELAYER_ENDPOINT || '/api/relayer/bridge'), {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ fromChain, toChain, sender: address, amount })
      });
      const j = await resp.json();
      if(resp.ok) setStatus('Bridge request submitted: ' + (j.txHash || JSON.stringify(j)));
      else setStatus('Relayer error: ' + (j.error || JSON.stringify(j)));
    }catch(e){
      setStatus('Network error: ' + e.message);
    }
  }

  return (
    <div style={{fontFamily: 'Inter, system-ui, sans-serif', background:'#f7fafc', minHeight:'100vh', padding:24}}>
      <div style={{maxWidth:720, margin:'0 auto', background:'#fff', borderRadius:16, padding:28, boxShadow:'0 8px 30px rgba(2,6,23,0.08)'}}>
        <h1 style={{fontSize:22, marginBottom:6}}>ZShift — Gasless LayerZero Demo</h1>
        <p style={{color:'#6b7280', marginBottom:18}}>Investor demo • Base &lt;&gt; Arbitrum (testnets)</p>

        <div style={{marginBottom:14}}>
          {!address ? (
            <button onClick={connect} style={{background:'#2563eb', color:'#fff', padding:'10px 14px', borderRadius:10, border:'none'}}>Connect Wallet</button>
          ) : (
            <div style={{fontSize:13, color:'#111'}}>Connected: {address}</div>
          )}
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12}}>
          <select value={fromChain} onChange={e=>setFromChain(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #e5e7eb'}}>
            <option value="base">Base Sepolia</option>
            <option value="arbitrum">Arbitrum Sepolia</option>
          </select>
          <select value={toChain} onChange={e=>setToChain(e.target.value)} style={{padding:10, borderRadius:8, border:'1px solid #e5e7eb'}}>
            <option value="arbitrum">Arbitrum Sepolia</option>
            <option value="base">Base Sepolia</option>
          </select>
        </div>

        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount (e.g. 1.0)" style={{width:'100%', padding:12, borderRadius:8, border:'1px solid #e5e7eb', marginBottom:12}} />

        <div style={{display:'flex', gap:10}}>
          <button onClick={submit} style={{background:'#10b981', color:'#fff', padding:'10px 14px', borderRadius:10, border:'none'}}>Bridge (gasless)</button>
          <button onClick={()=>{setAmount('0.1'); setStatus('');}} style={{padding:'10px 14px', borderRadius:10, border:'1px solid #e5e7eb'}}>Preset 0.1</button>
        </div>

        <div style={{marginTop:16, fontSize:13, color:'#374151'}}>Status: {status}</div>
      </div>
    </div>
  );
}
