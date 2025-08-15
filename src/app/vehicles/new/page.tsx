'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormState = {
  make: string; model: string; trim: string; year: string; month: string;
  engine: string; fuel: string; euro: string; transmission: string; drive: string;
  km: string; origin: string; vin: string; options: string; notes: string;
}

type InputProps = { label: string; name: keyof FormState; placeholder?: string; value: string; onChange: (v: string) => void }

function Field({ label, value, onChange, placeholder }: InputProps) {
  return (
    <div className="grid gap-1">
      <label className="text-sm text-gray-700">{label}</label>
      <input className="rounded-lg border p-2" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''}/>
    </div>
  )
}

export default function NewVehiclePage() {
  const r = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    make:'', model:'', trim:'', year:'', month:'', engine:'', fuel:'', euro:'',
    transmission:'', drive:'', km:'', origin:'GCC', vin:'', options:'', notes:''
  })
  const set = (k: keyof FormState) => (v: string) => setForm({ ...form, [k]: v })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle: form })
      })
      if (!res.ok) {
        const text = await res.text()
        alert(text || 'Errore nel salvataggio')
        return
      }
      const data = await res.json()
      r.push(`/vehicles/${data.id}`)
    } catch (err: any) {
      alert(err?.message || 'Errore nel salvataggio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nuovo Veicolo</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Field label="Marca" value={form.make} onChange={set('make')} placeholder="Maserati" />
        <Field label="Modello" value={form.model} onChange={set('model')} placeholder="GranCabrio" />
        <Field label="Allestimento" value={form.trim} onChange={set('trim')} placeholder="4.7 / MC" />
        <Field label="Anno" value={form.year} onChange={set('year')} placeholder="2015" />
        <Field label="Mese" value={form.month} onChange={set('month')} placeholder="1" />
        <Field label="Motore" value={form.engine} onChange={set('engine')} placeholder="4.7 V8" />
        <Field label="Carburante" value={form.fuel} onChange={set('fuel')} placeholder="Benzina" />
        <Field label="Euro" value={form.euro} onChange={set('euro')} placeholder="Euro 5/6" />
        <Field label="Cambio" value={form.transmission} onChange={set('transmission')} placeholder="Automatico" />
        <Field label="Trazione" value={form.drive} onChange={set('drive')} placeholder="Posteriore" />
        <Field label="Km" value={form.km} onChange={set('km')} placeholder="45000" />
        <Field label="Origine" value={form.origin} onChange={set('origin')} placeholder="GCC/EU/USA" />
        <Field label="VIN" value={form.vin} onChange={set('vin')} placeholder="ZAM..." />
        <Field label="Optional" value={form.options} onChange={set('options')} />
        <Field label="Note" value={form.notes} onChange={set('notes')} />
      </div>
      <button type="submit" disabled={loading} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-60">
        {loading ? 'Salvataggio…' : 'Salva'}
      </button>
    </form>
  )
}
