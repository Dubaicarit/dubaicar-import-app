'use client'
import { useState, useMemo } from 'react'

export default function VehicleEditor({ initial }: { initial: any }){
  const [v, setV] = useState<any>({
    ...initial,
    costs: initial.costs.length ? initial.costs : [
      { id: 'temp1', label:'Prezzo acquisto estero (EUR)', amount:0, note:'' },
      { id: 'temp2', label:'Spedizione internazionale', amount:0, note:'' },
      { id: 'temp3', label:'Dazio doganale', amount:0, note:'' },
      { id: 'temp4', label:'IVA importazione', amount:0, note:'' },
      { id: 'temp5', label:'Immatricolazione PRA + Targhe', amount:0, note:'' },
      { id: 'temp6', label:'IPT', amount:0, note:'' },
      { id: 'temp7', label:'Adeguamenti/Omologazione', amount:0, note:'' },
      { id: 'temp8', label:'Fondi imprevisti', amount:0, note:'' },
    ],
    market: initial.market || { eurotaxBase:null, eurotaxKm:null, minIT:null, avgIT:null, minLink:'', otherLinks:'', target:null },
  })

  const total = useMemo(()=> (v.costs||[]).reduce((s:any,c:any)=> s + (Number(c.amount)||0), 0), [v])

  const deltaBase = v.market?.eurotaxBase ? total - Number(v.market.eurotaxBase) : null
  const deltaMin  = v.market?.minIT ? total - Number(v.market.minIT) : null
  const margin    = v.market?.target ? Number(v.market.target) - total : null

  const verdict = useMemo(()=>{
    if (!total) return '—'
    const c1 = v.market?.eurotaxBase && total < Number(v.market.eurotaxBase)
    const c2 = v.market?.minIT && total < Number(v.market.minIT)
    if (c1 && c2) return 'Conveniente'
    if (c1 || c2) return 'Marginale'
    return 'Non conveniente'
  }, [total, v.market])

  const save = async () => {
    const res = await fetch(`/api/vehicles/${v.id}`, {
      method: 'PUT', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(v)
    })
    if (!res.ok) alert('Errore salvataggio')
  }

  const currency = (n:any) => n==null? '—' : new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(Number(n))

  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border bg-white p-6 shadow-sm grid md:grid-cols-3 gap-4">
        <div className="md:col-span-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dettagli veicolo</h2>
          <div className="text-sm text-gray-600">ID: {v.id}</div>
        </div>
        {['make','model','trim','year','month','engine','fuel','euro','transmission','drive','km','origin','vin'].map((key)=>(
          <div key={key} className="grid gap-1">
            <label className="text-sm text-gray-700">{key}</label>
            <input className="rounded-lg border p-2" value={v[key]||''} onChange={e=>setV({...v,[key]:e.target.value})}/>
          </div>
        ))}
        <div className="md:col-span-3 grid gap-1">
          <label className="text-sm text-gray-700">Optional</label>
          <textarea className="rounded-lg border p-2" rows={3} value={v.options||''} onChange={e=>setV({...v, options:e.target.value})}/>
        </div>
        <div className="md:col-span-3 grid gap-1">
          <label className="text-sm text-gray-700">Note</label>
          <textarea className="rounded-lg border p-2" rows={3} value={v.notes||''} onChange={e=>setV({...v, notes:e.target.value})}/>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Costi</h3>
        <div className="space-y-2">
          {(v.costs||[]).map((c:any, idx:number)=>(
            <div key={c.id || idx} className="grid grid-cols-12 gap-2 items-center">
              <input className="col-span-5 rounded-lg border p-2" value={c.label} onChange={e=>{
                const copy = [...v.costs]; copy[idx].label = e.target.value; setV({...v, costs:copy});
              }}/>
              <input className="col-span-3 rounded-lg border p-2" type="number" value={c.amount} onChange={e=>{
                const copy = [...v.costs]; copy[idx].amount = Number(e.target.value||0); setV({...v, costs:copy});
              }}/>
              <input className="col-span-4 rounded-lg border p-2" value={c.note||''} placeholder="Note" onChange={e=>{
                const copy = [...v.costs]; copy[idx].note = e.target.value; setV({...v, costs:copy});
              }}/>
            </div>
          ))}
          <div className="flex justify-between items-center pt-2">
            <div className="text-sm text-gray-600">Totale costi · <span className="font-semibold">{currency(total)}</span></div>
            <button className="px-3 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100" onClick={()=>setV({...v, costs:[...v.costs, {label:'Nuova voce', amount:0, note:''}]})}>+ Aggiungi voce</button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Mercato</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {['eurotaxBase','eurotaxKm','minIT','avgIT','target'].map((key)=>(
            <div key={key} className="grid gap-1">
              <label className="text-sm text-gray-700">{key}</label>
              <input className="rounded-lg border p-2" type="number" value={v.market?.[key] ?? ''} onChange={e=>setV({...v, market:{...v.market, [key]: e.target.value}})} />
            </div>
          ))}
          <div className="md:col-span-3 grid gap-1">
            <label className="text-sm text-gray-700">Link annuncio minimo</label>
            <input className="rounded-lg border p-2" value={v.market?.minLink||''} onChange={e=>setV({...v, market:{...v.market, minLink:e.target.value}})} />
          </div>
          <div className="md:col-span-3 grid gap-1">
            <label className="text-sm text-gray-700">Altri link</label>
            <textarea className="rounded-lg border p-2" rows={3} value={v.market?.otherLinks||''} onChange={e=>setV({...v, market:{...v.market, otherLinks:e.target.value}})} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <div className="flex justify-between"><span>Prezzo Finale</span><span className="font-semibold">{currency(total)}</span></div>
          <div className="flex justify-between"><span>Δ vs Eurotax Base</span><span className={(deltaBase!=null && deltaBase<0)?'text-green-700 font-semibold':'text-red-700 font-semibold'}>{deltaBase==null?'—':currency(deltaBase)}</span></div>
          <div className="flex justify-between"><span>Δ vs Min IT</span><span className={(deltaMin!=null && deltaMin<0)?'text-green-700 font-semibold':'text-red-700 font-semibold'}>{deltaMin==null?'—':currency(deltaMin)}</span></div>
          <div className="flex justify-between"><span>Margine atteso</span><span className={(margin!=null && margin>0)?'text-green-700 font-semibold':'text-red-700 font-semibold'}>{margin==null?'—':currency(margin)}</span></div>
        </div>
        <div className="flex items-end justify-end">
          <div className={"px-4 py-2 rounded-lg border " + (verdict==='Conveniente'?'bg-green-600 text-white': verdict==='Marginale'?'bg-yellow-400':'bg-red-600 text-white') }>
            {verdict}
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button onClick={save} className="px-3 py-2 rounded-lg border bg-blue-600 text-white">Salva</button>
      </div>
    </div>
  )
}
