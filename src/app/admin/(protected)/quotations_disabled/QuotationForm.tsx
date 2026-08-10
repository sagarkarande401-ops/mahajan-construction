"use client";

import { useState } from "react";
import { createQuotation, updateQuotation } from "@/app/actions/admin-quotations";
import { Label, Input, Textarea } from "@/components/ui/form-fields";

export function QuotationForm({ prefill, onSaved }: { prefill?: any; onSaved?: () => void }) {
  const [clientName, setClientName] = useState(prefill?.clientName || "");
  const [enquiryId] = useState(prefill?.enquiryId || "");
  const [projectType, setProjectType] = useState(prefill?.projectType || "");
  const [location, setLocation] = useState(prefill?.location || "");
  const [validUntil, setValidUntil] = useState(prefill?.validUntil || "");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<{ description: string; quantity: number; unit?: string; rate: number; amount?: number }[]>([{ description: "", quantity: 1, unit: "", rate: 0, amount: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);
  const [total, setTotal] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const recalc = (newItems = items, d = discount, g = gst) => {
    const st = newItems.reduce((s, it) => s + ((it.quantity || 0) * (it.rate || 0)), 0);
    const afterDiscount = st - (d || 0);
    const gstAmt = (afterDiscount * (g || 0)) / 100;
    const tot = afterDiscount + gstAmt;
    setSubtotal(st);
    setTotal(tot);
  };

  const updateItem = (index: number, patch: Partial<typeof items[0]>) => {
    const copy = items.slice();
    copy[index] = { ...copy[index], ...patch } as any;
    copy[index].amount = (copy[index].quantity || 0) * (copy[index].rate || 0);
    setItems(copy);
    recalc(copy, discount, gst);
  };

  const addRow = () => { setItems([...items, { description: "", quantity: 1, unit: "", rate: 0, amount: 0 }]); };
  const removeRow = (i: number) => { const c = items.slice(); c.splice(i,1); setItems(c); recalc(c, discount, gst); };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      if (!clientName) { setError('Client name is required'); setSaving(false); return; }
      const computedSubtotal = items.reduce((s, it) => s + (it.quantity * it.rate), 0);
      const computedTotal = (computedSubtotal - (discount || 0)) + (((computedSubtotal - (discount || 0)) * (gst || 0)) / 100);
      await createQuotation({ enquiryId, quotationNumber: `Q-${Date.now()}`, clientName, projectType, location, validUntil: validUntil || null, subtotal: computedSubtotal, discount, gst, total: computedTotal, notes, items });
      if (onSaved) onSaved();
    } catch (err) {
      console.error(err); setError('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && <div className="border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label>Client name</Label>
          <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </div>
        <div>
          <Label>Project type</Label>
          <Input value={projectType} onChange={(e) => setProjectType(e.target.value)} />
        </div>
        <div>
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <Label>Valid until</Label>
          <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
        </div>
      </div>

      <div>
        <Label>Items</Label>
        <div className="mt-2 space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <input className="col-span-6 border border-line bg-transparent px-3 py-2 text-sm" value={it.description} placeholder="Description" onChange={(e) => updateItem(idx, { description: e.target.value })} />
              <input className="col-span-1 border border-line bg-transparent px-3 py-2 text-sm" type="number" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} />
              <input className="col-span-1 border border-line bg-transparent px-3 py-2 text-sm" value={it.unit} placeholder="Unit" onChange={(e) => updateItem(idx, { unit: e.target.value })} />
              <input className="col-span-2 border border-line bg-transparent px-3 py-2 text-sm" type="number" value={it.rate} onChange={(e) => updateItem(idx, { rate: Number(e.target.value) })} />
              <div className="col-span-1 text-sm">₹{(it.amount || 0).toFixed(2)}</div>
              <button type="button" className="col-span-1 text-red-600" onClick={() => removeRow(idx)}>Remove</button>
            </div>
          ))}
          <div className="mt-2"><button type="button" onClick={addRow} className="border border-line px-3 py-2 text-sm">Add item</button></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label>Subtotal</Label>
          <Input value={`₹${subtotal.toFixed(2)}`} readOnly />
        </div>
        <div>
          <Label>Discount</Label>
          <Input type="number" value={discount} onChange={(e) => { setDiscount(Number(e.target.value)); recalc(items, Number(e.target.value), gst); }} />
        </div>
        <div>
          <Label>GST %</Label>
          <Input type="number" value={gst} onChange={(e) => { setGst(Number(e.target.value)); recalc(items, discount, Number(e.target.value)); }} />
        </div>
      </div>

      <div>
        <Label>Total</Label>
        <Input value={`₹${total.toFixed(2)}`} readOnly />
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="h-10 rounded bg-ink px-4 text-sm text-canvas">{saving ? 'Saving...' : 'Save Quotation'}</button>
      </div>
    </div>
  );
}
