'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewVehiclePage(){
  const r = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    make: '', model: '', trim: '', year: '', month: '',
    engine: '', fuel: '', euro: '', transmission: '', drive: '',
    km: '', origin: 'GCC', vin: '', options: '', notes: ''
  })

  const submit = async (e:any) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/vehicles', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ vehicle: form })
    })
    setLoading(false)
    if (res.ok){
      const data = await res.json()
      r.push(`/vehicles/${data.id}`)
    } else {
      alert('Errore salvataggio')
    }
  }

  const I = (p:any) => (
    <div className="grid gap-1">
      <label className="text-sm text-gray-700">{p.label}</label>
      <input className="rounded-lg border p-2" value={form[p.name]} onChange={e=>setForm({...form,[p.name]:e.target.value})} placeholder={p.placeholder||''}/>
    </div>
  )

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm grid gap-4">
        <h2 className="text-lg font-semibold">Nuovo veicolo</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {I({label:'Marca', name:'make', placeholder:'Maserati'})}
          {I({label:'Modello', name:'model', placeholder:'GranCabrio'})}
          {I({label:'Allestimento', name:'trim', placeholder:'4.7 / MC'})}
          {I({label:'Anno', name:'year', placeholder:'2015'})}
          {I({label:'Mese', name:'month', placeholder:'1'})}
          {I({label:'Motore', name:'engine', placeholder:'4.7 V8'})}
          {I({label:'Alimentazione', name:'fuel', placeholder:'Benzina'})}
          {I({label:'Norma Euro', name:'euro', placeholder:'Euro 5'})}
          {I({label:'Cambio', name:'transmission', placeholder:'Automatico'})}
          {I({label:'Trazione', name:'drive', placeholder:'Posteriore'})}
          {I({label:'Km', name:'km', placeholder:'45000'})}
          {I({label:'Provenienza', name:'origin', placeholder:'GCC'})}
          {I({label:'VIN', name:'vin', placeholder:'ZAM...'})}
        </div>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <label className="text-sm text-gray-700">Optional principali</label>
            <textarea className="rounded-lg border p-2" rows={3} value={form.options} onChange={e=>setForm({...form, options:e.target.value})}/>
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-gray-700">Note</label>
            <textarea className="rounded-lg border p-2" rows={3} value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
          </div>
        </div>
        <div className="flex gap-3">
          <button disabled={loading} className="px-3 py-2 rounded-lg border bg-blue-600 text-white disabled:opacity-60">{loading?'Salvo…':'Salva'}</button>
        </div>
      </div>
    </form>
  )
}
