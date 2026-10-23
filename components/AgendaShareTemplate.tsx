import React from 'react';
import type {Evento} from './AgendaMensalShareEnhanced';

export type ArtFormat='feed'|'story'|'square';
export type ArtModel='colagem'|'clean'|'destaque';
export type ArtPeriod='mes'|'semana'|'evento';
type Props={mes:string;ano:number;eventos:Evento[];formato:ArtFormat;modelo:ArtModel;periodo:ArtPeriod};
export default function AgendaShareTemplate({mes,ano,eventos,formato,modelo,periodo}:Props){
 const width=1080,height=formato==='story'?1920:formato==='square'?1080:1350;
 const items=[...eventos].sort((a,b)=>a.dia-b.dia).slice(0,periodo==='evento'?1:periodo==='semana'?5:formato==='story'?6:8);
 const clean=modelo==='clean';
 return <div style={{width,height,boxSizing:'border-box',overflow:'hidden',position:'relative',background:clean?'#f9fbff':'#c99a63',color:'#10284e',fontFamily:'Arial,sans-serif',padding:44,display:'flex',flexDirection:'column',gap:25}}>
   <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:clean?.03:.10,backgroundImage:'radial-gradient(#19365a 1.2px,transparent 1.2px)',backgroundSize:'18px 18px'}}/>
   <div style={{position:'relative',background:'#fff',borderRadius:16,padding:25,display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'5px 9px 0 #1c406126'}}>
     <div style={{display:'flex',alignItems:'center',gap:22}}><img src="/assets/eac/logo-eac.png" width="115" height="115" style={{objectFit:'contain'}} alt="Logo EAC"/><div><strong style={{fontSize:53}}>EAC</strong><div style={{fontSize:22,fontWeight:900}}>PORCIÚNCULA DE SANT'ANNA</div></div></div>
     <div style={{background:'#ffcc05',padding:'16px 23px',fontSize:25,fontWeight:900,transform:'rotate(-3deg)'}}>VIVA O EAC!<br/>FAÇA ACONTECER!</div>
   </div>
   <div style={{position:'relative',textAlign:'center',background:'#063a73',color:'white',padding:'26px 14px 24px',transform:clean?'none':'rotate(-1deg)',borderRadius:clean?20:3}}>
     <div style={{fontSize:periodo==='evento'?66:84,fontWeight:1000,lineHeight:1.04}}>{periodo==='mes'?'AGENDA EAC':periodo==='semana'?'ESSA SEMANA NO EAC':'NÃO PERCA!'}</div>
     <div style={{fontSize:48,fontWeight:900,color:'#b8fa26',marginTop:8}}>{mes.toUpperCase()} {ano}</div>
   </div>
   <div style={{position:'relative',display:'grid',gridTemplateColumns:formato==='story'||periodo==='evento'?'1fr':'1fr 1fr',alignContent:'start',gap:20,flex:1}}>
    {items.map((ev,i)=><div key={i} style={{display:'flex',alignItems:'center',background:'#fffdf8',boxShadow:'6px 8px 0 #122d4728',borderRadius:clean?18:3,overflow:'hidden',minHeight:periodo==='evento'?280:formato==='story'?130:145}}>
      <div style={{minWidth:110,alignSelf:'stretch',background:['#ef3340','#073f7e','#0c9b78','#ffcb07'][i%4],color:i%4===3?'#10284e':'white',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontWeight:900}}>
        <div style={{fontSize:57,lineHeight:1}}>{String(ev.dia).padStart(2,'0')}</div><div style={{fontSize:22}}>{ev.diaSemana.toUpperCase()}</div>
      </div>
      <div style={{padding:16,minWidth:0}}><div style={{fontSize:periodo==='evento'?34:26,fontWeight:900,lineHeight:1.13,wordBreak:'break-word'}}>{ev.titulo}</div><div style={{marginTop:12,fontSize:22,fontWeight:700}}>◷ {ev.horario||'Confira o horário'}</div></div>
    </div>)}
    {items.length===0&&<div style={{background:'white',padding:40,fontSize:28}}>Fique ligado! Novos eventos podem entrar na agenda.</div>}
   </div>
   <div style={{position:'relative',padding:'22px 26px',background:'#ffcb07',fontWeight:900,fontSize:25,textAlign:'center'}}>✨ FIQUE LIGADO: NOVOS EVENTOS PODEM ENTRAR NA AGENDA!</div>
   <div style={{position:'relative',background:'#0e192e',color:'white',padding:'29px 32px',fontSize:29,fontWeight:900,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
     <div>NÃO FIQUE DE FORA!<br/><span style={{color:'#ffcb07'}}>MARQUE NA AGENDA E CHAME A GALERA!</span><div style={{fontSize:19,marginTop:15,fontWeight:700}}>@eacporciunculadesantana</div></div>
     <img src="/assets/eac/menina-eac.png" alt="" style={{height:150,maxWidth:180,objectFit:'contain'}}/>
   </div>
 </div>;
}
