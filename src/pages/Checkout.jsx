import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import OrderSummary from "../components/OrderSummary";
import SectionHeader from "../components/SectionHeader";
import { useCart } from "../context/CartContext";
import { createOrderId, submitOrder } from "../utils/orders";
import { useTranslation } from "../i18n";

const MERCHANT = {
  telebirr: { till: "1234", name: "Zu Burger Spot" },
  cbebirr:  { accountNumber: "1000123456789", accountName: "Zu Burger Spot" },
  bank: {
    bankName: "Commercial Bank of Ethiopia",
    accountNumber: "1000123456789",
    accountName: "Zu Burger Spot",
    branch: "Shashemene Main Branch",
  },
};

const METHODS = [
  { id: "telebirr", label: "Telebirr",          sub: "Ethio Telecom mobile money", popular: true },
  { id: "cbebirr",  label: "CBEBirr",            sub: "CBE mobile money" },
  { id: "chapa",    label: "Chapa",              sub: "Card, bank & more" },
  { id: "bank",     label: "Bank transfer",      sub: "Direct CBE deposit" },
  { id: "cash",     label: "Cash on delivery",   sub: "Pay when your order arrives" },
];

function CopyBox({ label, value }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2.5">
      <div className="mr-3 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{label}</p>
        <p className="truncate font-mono text-sm font-bold text-zinc-800">{value}</p>
      </div>
      <button type="button" onClick={copy}
        className="shrink-0 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 active:scale-95">
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

function TelebirrPanel({ orderId, total }) {
  return (
    <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50 p-5">
      <div>
        <p className="font-black text-blue-900">Pay via Telebirr</p>
        <p className="text-sm text-blue-600">Send payment to our Telebirr merchant till</p>
      </div>
      <ol className="space-y-1.5 text-sm text-blue-800">
        {[
          "Open your Telebirr app",
          "Go to Pay → Merchant Payment",
          `Enter till number: ${MERCHANT.telebirr.till} — confirm name shows "${MERCHANT.telebirr.name}"`,
          `Enter exact amount: ETB ${total.toLocaleString()}`,
          "Type your Order ID in the reference/note field",
          "Confirm with your PIN — save the transaction code",
          "Paste your transaction code below (optional — speeds up your order)",
        ].map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-black text-blue-900">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="space-y-1.5">
        <CopyBox label="Merchant Till"        value={MERCHANT.telebirr.till} />
        <CopyBox label="Merchant Name"        value={MERCHANT.telebirr.name} />
        <CopyBox label="Amount (ETB)"         value={total.toLocaleString()} />
        <CopyBox label="Order ID (Reference)" value={orderId} />
      </div>
      <p className="text-xs italic text-blue-500">ለ Telebirr ሲከፍሉ የትዕዛዝ መለያ ቁጥሩን ማስፈጸሚያ ቦታ ላይ ያስቀምጡ።</p>
    </div>
  );
}

function CbebirrPanel({ orderId, total }) {
  return (
    <div className="space-y-3 rounded-xl border border-green-100 bg-green-50 p-5">
      <div>
        <p className="font-black text-green-900">Pay via CBEBirr</p>
        <p className="text-sm text-green-600">Commercial Bank of Ethiopia mobile money</p>
      </div>
      <ol className="space-y-1.5 text-sm text-green-800">
        {[
          "Open your CBEBirr app",
          "Select Transfer → to CBEBirr Account",
          "Enter our account number below",
          `Enter exact amount: ETB ${total.toLocaleString()}`,
          "Add your Order ID in the remark/note field",
          "Confirm with your PIN — note the reference number",
          "Paste that reference number below (optional — speeds up your order)",
        ].map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-200 text-[10px] font-black text-green-900">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="space-y-1.5">
        <CopyBox label="Account Number"    value={MERCHANT.cbebirr.accountNumber} />
        <CopyBox label="Account Name"      value={MERCHANT.cbebirr.accountName} />
        <CopyBox label="Amount (ETB)"      value={total.toLocaleString()} />
        <CopyBox label="Order ID (Remark)" value={orderId} />
      </div>
      <p className="text-xs italic text-green-600">ክፍያ ከፈጸሙ በኋላ የ CBEBirr ሂሳብ ቁጥሩን ከዚህ በታች ያስገቡ።</p>
    </div>
  );
}

function ChapaPanel({ orderId, total }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const handleClick = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
  };
  return (
    <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50 p-5">
      <div>
        <p className="font-black text-amber-900">Pay with Chapa</p>
        <p className="text-sm text-amber-600">Secure checkout — card, bank, or mobile money</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["Visa","Mastercard","Telebirr","CBEBirr","HelloCash","Amole","Awash Bank","Dashen","CBE"].map(b => (
          <span key={b} className="rounded-md border border-amber-200 bg-white px-2 py-0.5 text-xs font-semibold text-amber-800">{b}</span>
        ))}
      </div>
      <div className="rounded-lg border border-amber-200 bg-white px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Total to pay</p>
        <p className="font-mono text-2xl font-black text-amber-900">ETB {total.toLocaleString()}</p>
        <p className="text-xs text-zinc-400">Order #{orderId}</p>
      </div>
      {done ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-200 font-black text-green-800">✓</span>
          <div>
            <p className="text-sm font-black text-green-900">Payment confirmed!</p>
            <p className="text-xs text-green-700">Chapa processed your payment successfully.</p>
          </div>
        </div>
      ) : (
        <button type="button" onClick={handleClick} disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-black text-white transition hover:bg-amber-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? (
            <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Connecting to Chapa…</>
          ) : <>🔒 Pay ETB {total.toLocaleString()} with Chapa</>}
        </button>
      )}
      <p className="text-center text-xs italic text-amber-600">ወደ Chapa ደህንነቱ የተጠበቀ ክፍያ ገጽ ይዛወራሉ።</p>
    </div>
  );
}

function BankPanel({ orderId, total }) {
  const { bankName, accountNumber, accountName, branch } = MERCHANT.bank;
  return (
    <div className="space-y-3 rounded-xl border border-purple-100 bg-purple-50 p-5">
      <div>
        <p className="font-black text-purple-900">Bank transfer (CBE)</p>
        <p className="text-sm text-purple-600">Direct deposit to our bank account</p>
      </div>
      <ol className="space-y-1.5 text-sm text-purple-800">
        {[
          "Visit a CBE branch or use CBE mobile/online banking",
          `Transfer ETB ${total.toLocaleString()} to the account below`,
          "Use your Order ID as the transfer remark",
          "Enter your bank reference number below after transferring",
        ].map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-200 text-[10px] font-black text-purple-900">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="space-y-1.5">
        <CopyBox label="Bank"             value={bankName} />
        <CopyBox label="Account Number"   value={accountNumber} />
        <CopyBox label="Account Name"     value={accountName} />
        <CopyBox label="Branch"           value={branch} />
        <CopyBox label="Amount (ETB)"     value={total.toLocaleString()} />
        <CopyBox label="Transfer Remark"  value={orderId} />
      </div>
      <p className="text-xs italic text-purple-500">ዝውውሩ ከተፈጸመ በኋላ የ CBE ሂሳብ ቁጥሩን ከዚህ ይለጥፉ።</p>
    </div>
  );
}

function CashPanel({ total }) {
  return (
    <div className="space-y-3 rounded-xl border border-teal-100 bg-teal-50 p-5">
      <div>
        <p className="font-black text-teal-900">Cash on delivery</p>
        <p className="text-sm text-teal-600">Pay when your order arrives at your door</p>
      </div>
      <ul className="space-y-2 text-sm text-teal-800">
        {[
          "No upfront payment required",
          `Have the exact amount ready — ETB ${total.toLocaleString()}`,
          "Our delivery team will call you before arriving",
          "A receipt will be provided on delivery",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 text-teal-400">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs italic text-teal-500">ሲቪል ሲደርስ ክፍያ ይፈጸማል። ትክክለኛ ገንዘብ ቢዘጋጁ ማስረከቢያ ይቀላሉ።</p>
    </div>
  );
}

function RefInput({ method, value, onChange }) {
  if (method === "cash" || method === "chapa") return null;
  const config = {
    telebirr: { label: "Telebirr transaction code", placeholder: "e.g. TT123456789" },
    cbebirr:  { label: "CBEBirr reference number",  placeholder: "e.g. CBB987654321" },
    bank:     { label: "Bank transfer reference",    placeholder: "Found on your transfer receipt" },
  };
  const { label, placeholder } = config[method] || {};
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">
        {label}{" "}
        <span className="font-normal text-zinc-400">(optional — speeds up verification)</span>
      </span>
      <input
        className="h-12 w-full rounded-lg border border-zinc-200 px-4 font-mono outline-none focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
        type="text" value={value} onChange={onChange} placeholder={placeholder}
      />
    </label>
  );
}

function MethodSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {METHODS.map((m) => (
        <button key={m.id} type="button" onClick={() => onSelect(m.id)}
          className={`relative flex flex-col items-start gap-1.5 rounded-xl border-2 p-3.5 text-left transition-all
            ${m.id === "cash" ? "col-span-2 sm:col-span-1" : ""}
            ${selected === m.id ? "border-red-700 bg-red-50" : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"}`}>
          {m.popular && (
            <span className="absolute -right-2 -top-2.5 rounded-full bg-red-700 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">Popular</span>
          )}
          <p className="text-sm font-black text-zinc-900">{m.label}</p>
          <p className="text-[11px] text-zinc-400">{m.sub}</p>
          {selected === m.id && <span className="absolute right-2.5 top-2.5 text-xs font-black text-red-700">✓</span>}
        </button>
      ))}
    </div>
  );
}

const initialForm = { name: "", phone: "", address: "", notes: "" };

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { t } = useTranslation();
  const [form, setForm]           = useState(initialForm);
  const [method, setMethod]       = useState("telebirr");
  const [ref, setRef]             = useState("");
  const [errors, setErrors]       = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const navigate = useNavigate();
  const [orderId] = useState(() => createOrderId());

  const updateField = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim())    next.name    = t("checkout.errors.name");
    if (!form.phone.trim()) {
      next.phone = t("checkout.errors.phone");
    } else if (!/^\d+$/.test(form.phone.trim())) {
      next.phone = t("checkout.errors.phoneNumeric") || t("checkout.errors.phone");
    }
    if (!form.address.trim()) next.address = t("checkout.errors.address");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    if (method === "chapa") {
      setSubmitError("Please use the 'Pay with Chapa' button above to complete payment.");
      return;
    }
    setSubmitting(true);
    const order = {
      id: orderId,
      customer: form,
      items,
      total,
      paymentMethod: method,
      transactionRef: ref.trim() || null,
      status: method === "cash" ? "Awaiting Delivery" : ref.trim() ? "Payment Submitted — Verifying" : "Awaiting Verification",
      createdAt: new Date().toISOString(),
    };
    const result = await submitOrder(order);
    setSubmitting(false);
    if (result.ok === false && !result.fallback) {
      setSubmitError(result.error || t("checkout.errors.submit"));
      return;
    }
    clearCart();
    navigate(`/order-success/${order.id}`);
  };

  if (items.length === 0) {
    return (
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState title={t("checkout.emptyTitle")} body={t("checkout.emptyBody")} />
        </div>
      </section>
    );
  }

  const submitLabel = submitting ? t("checkout.placing") : method === "chapa" ? "Pay with Chapa above ↑" : t("checkout.placeOrder");
  const submitNote  = method === "cash"  ? "Our delivery team will call you before arriving."
                    : method === "chapa" ? "Use the Chapa button above — order confirmed automatically."
                    : "We'll verify your payment and start preparing your order right away.";

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={t("checkout.eyebrow")} title={t("checkout.title")} body={t("checkout.body")} />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <form className="space-y-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm" onSubmit={submit} noValidate>

            {/* Step 1 */}
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-zinc-400">1 — Your details</p>
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  { name: "name",  label: t("checkout.fields.name"),  type: "text" },
                  { name: "phone", label: t("checkout.fields.phone"), type: "tel"  },
                ].map((field) => (
                  <label key={field.name} className="block">
                    <span className="mb-2 block text-sm font-black">{field.label}</span>
                    <input
                      className={`h-12 w-full rounded-lg border px-4 outline-none focus:ring-4 focus:ring-yellow-200 ${errors[field.name] ? "border-red-700" : "border-zinc-200 focus:border-red-800"}`}
                      name={field.name} type={field.type}
                      inputMode={field.type === "tel" ? "numeric" : undefined}
                      pattern={field.type === "tel" ? "[0-9]*" : undefined}
                      value={form[field.name]} onChange={updateField}
                      aria-invalid={Boolean(errors[field.name])}
                    />
                    {errors[field.name] && <span className="mt-2 block text-sm font-bold text-red-700">{errors[field.name]}</span>}
                  </label>
                ))}
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-black">{t("checkout.fields.address")}</span>
                <textarea
                  className={`min-h-28 w-full rounded-lg border px-4 py-3 outline-none focus:ring-4 focus:ring-yellow-200 ${errors.address ? "border-red-700" : "border-zinc-200 focus:border-red-800"}`}
                  name="address" value={form.address} onChange={updateField}
                  placeholder="Kebele, area name, or a nearby landmark"
                  aria-invalid={Boolean(errors.address)}
                />
                {errors.address && <span className="mt-2 block text-sm font-bold text-red-700">{errors.address}</span>}
              </label>
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-black">{t("checkout.fields.notes")}</span>
                <textarea
                  className="min-h-24 w-full rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
                  name="notes" value={form.notes} onChange={updateField}
                  placeholder={t("checkout.notesPlaceholder") || "Allergies, no onions, ring the gate bell…"}
                />
              </label>
            </div>

            {/* Step 2 */}
            <div className="border-t border-zinc-100 pt-2">
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-zinc-400">2 — Payment method</p>
              <MethodSelector selected={method} onSelect={(m) => { setMethod(m); setRef(""); }} />
            </div>

            {/* Payment panel */}
            <div>
              {method === "telebirr" && <TelebirrPanel orderId={orderId} total={total} />}
              {method === "cbebirr"  && <CbebirrPanel  orderId={orderId} total={total} />}
              {method === "chapa"    && <ChapaPanel    orderId={orderId} total={total} />}
              {method === "bank"     && <BankPanel     orderId={orderId} total={total} />}
              {method === "cash"     && <CashPanel     total={total} />}
            </div>

            {/* Ref input */}
            <RefInput method={method} value={ref} onChange={(e) => setRef(e.target.value)} />

            {/* Step 3 */}
            <div className="border-t border-zinc-100 pt-2">
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-zinc-400">3 — Place your order</p>
              <p className="mb-5 text-sm text-zinc-500">{submitNote}</p>
              {submitError && <p className="mb-4 text-sm font-bold text-red-700">{submitError}</p>}
              <Button className="w-full sm:w-auto" type="submit" disabled={submitting || method === "chapa"}>
                {submitLabel}
              </Button>
            </div>

          </form>
          <OrderSummary cta={false} />
        </div>
      </div>
    </section>
  );
}
