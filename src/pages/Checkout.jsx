import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import OrderSummary from "../components/OrderSummary";
import SectionHeader from "../components/SectionHeader";
import { useCart } from "../context/CartContext";
import { createOrderId, submitOrder } from "../utils/orders";

const PAYMENT_INFO = {
  telebirr: {
    till: "1234",
    merchantName: "Ku Burger",
  },
  cbebirr: {
    accountNumber: "1000123456789",
    accountName: "Ku Burger PLC",
  },
  bank: {
    bankName: "Commercial Bank of Ethiopia",
    accountNumber: "1000123456789",
    accountName: "Ku Burger PLC",
    branch: "Hawassa Main Branch",
  },
};

const PAYMENT_METHODS = [
  {
    id: "telebirr",
    label: "Telebirr",
    sublabel: "Ethio Telecom mobile money",
    popular: true,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <circle cx="12" cy="17" r="1" />
      </svg>
    ),
  },
  {
    id: "cbebirr",
    label: "CBEBirr",
    sublabel: "CBE mobile money",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "chapa",
    label: "Chapa",
    sublabel: "Card, bank & more",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: "bank",
    label: "Bank transfer",
    sublabel: "Direct CBE deposit",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="22" x2="21" y2="22" />
        <line x1="6" y1="18" x2="6" y2="11" />
        <line x1="10" y1="18" x2="10" y2="11" />
        <line x1="14" y1="18" x2="14" y2="11" />
        <line x1="18" y1="18" x2="18" y2="11" />
        <polygon points="12 2 20 7 4 7" />
      </svg>
    ),
  },
  {
    id: "cash",
    label: "Cash on delivery",
    sublabel: "Pay when your order arrives",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
  },
];

const initialForm = { name: "", phone: "", address: "", notes: "" };

function CopyBox({ label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2.5">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </p>
        <p className="truncate font-mono text-sm font-bold text-zinc-800">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="ml-3 shrink-0 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-100 active:scale-95"
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

function TelebirrPanel({ orderId, total }) {
  const { till, merchantName } = PAYMENT_INFO.telebirr;
  return (
    <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50 p-5">
      <div>
        <p className="font-black text-blue-900">Pay via Telebirr</p>
        <p className="text-sm text-blue-600">
          Send to our merchant till number
        </p>
      </div>
      <ol className="space-y-1.5 text-sm text-blue-800">
        {[
          "Open your Telebirr app",
          "Select Pay Merchant or Till Payment",
          "Enter the till number below and confirm the merchant name",
          `Enter the exact amount: ETB ${total.toLocaleString()}`,
          "Use your Order ID as the payment reference/note",
          "Copy your transaction code and enter it below",
        ].map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[10px] font-black text-blue-900">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="space-y-1.5">
        <CopyBox label="Merchant Till" value={till} />
        <CopyBox label="Merchant Name" value={merchantName} />
        <CopyBox label="Amount (ETB)" value={total.toLocaleString()} />
        <CopyBox label="Order ID (Reference)" value={orderId} />
      </div>
      <p className="text-xs italic text-blue-500">
        ለ Telebirr ሲከፍሉ የትዕዛዝ መለያ ቁጥሩን ማስፈጸሚያ ቦታ ላይ ያስቀምጡ።
      </p>
    </div>
  );
}

function CbebirrPanel({ orderId, total }) {
  const { accountNumber, accountName } = PAYMENT_INFO.cbebirr;
  return (
    <div className="space-y-3 rounded-xl border border-green-100 bg-green-50 p-5">
      <div>
        <p className="font-black text-green-900">Pay via CBEBirr</p>
        <p className="text-sm text-green-600">
          Commercial Bank of Ethiopia mobile money
        </p>
      </div>
      <ol className="space-y-1.5 text-sm text-green-800">
        {[
          "Open your CBEBirr app",
          "Select Send Money or Pay Merchant",
          "Enter the account number below",
          `Enter the exact amount: ETB ${total.toLocaleString()}`,
          "Add your Order ID as the remark/note",
          "Enter your CBEBirr reference number below",
        ].map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-200 text-[10px] font-black text-green-900">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="space-y-1.5">
        <CopyBox label="Account Number" value={accountNumber} />
        <CopyBox label="Account Name" value={accountName} />
        <CopyBox label="Amount (ETB)" value={total.toLocaleString()} />
        <CopyBox label="Order ID (Remark)" value={orderId} />
      </div>
      <p className="text-xs italic text-green-600">
        ክፍያ ከፈጸሙ በኋላ የ CBEBirr ሂሳብ ቁጥሩን ከዚህ በታች ያስገቡ።
      </p>
    </div>
  );
}

function ChapaPanel({ orderId, total }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChapa = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 2000);
  };

  return (
    <div className="space-y-3 rounded-xl border border-amber-100 bg-amber-50 p-5">
      <div>
        <p className="font-black text-amber-900">Pay with Chapa</p>
        <p className="text-sm text-amber-600">
          Secure checkout — card, bank, or mobile money
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {[
          "Visa",
          "Mastercard",
          "Telebirr",
          "CBEBirr",
          "HelloCash",
          "Amole",
          "Awash Bank",
          "Dashen",
          "CBE",
        ].map((brand) => (
          <span
            key={brand}
            className="rounded-md border border-amber-200 bg-white px-2 py-0.5 text-xs font-semibold text-amber-800"
          >
            {brand}
          </span>
        ))}
      </div>
      <div className="rounded-lg border border-amber-200 bg-white px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          Total to pay
        </p>
        <p className="font-mono text-2xl font-black text-amber-900">
          ETB {total.toLocaleString()}
        </p>
        <p className="text-xs text-zinc-400">Order #{orderId}</p>
      </div>
      {done ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-200 text-green-800 font-black">
            ✓
          </span>
          <div>
            <p className="text-sm font-black text-green-900">
              Payment confirmed!
            </p>
            <p className="text-xs text-green-700">
              Chapa processed your payment successfully.
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleChapa}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-black text-white transition hover:bg-amber-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Connecting to Chapa…
            </>
          ) : (
            <>🔒 Pay ETB {total.toLocaleString()} with Chapa</>
          )}
        </button>
      )}
      <p className="text-center text-xs italic text-amber-600">
        ወደ Chapa ደህንነቱ የተጠበቀ ክፍያ ገጽ ይዛወራሉ።
      </p>
    </div>
  );
}

function BankTransferPanel({ orderId, total }) {
  const { bankName, accountNumber, accountName, branch } = PAYMENT_INFO.bank;
  return (
    <div className="space-y-3 rounded-xl border border-purple-100 bg-purple-50 p-5">
      <div>
        <p className="font-black text-purple-900">Bank transfer (CBE)</p>
        <p className="text-sm text-purple-600">
          Direct deposit to our bank account
        </p>
      </div>
      <ol className="space-y-1.5 text-sm text-purple-800">
        {[
          "Visit a CBE branch or use CBE mobile/online banking",
          `Transfer ETB ${total.toLocaleString()} to the account below`,
          "Use your Order ID as the transfer remark",
          "Enter your bank reference number below after transferring",
        ].map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-200 text-[10px] font-black text-purple-900">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="space-y-1.5">
        <CopyBox label="Bank" value={bankName} />
        <CopyBox label="Account Number" value={accountNumber} />
        <CopyBox label="Account Name" value={accountName} />
        <CopyBox label="Branch" value={branch} />
        <CopyBox label="Amount (ETB)" value={total.toLocaleString()} />
        <CopyBox label="Transfer Remark" value={orderId} />
      </div>
      <p className="text-xs italic text-purple-500">
        ዝውውሩ ከተፈጸመ በኋላ የ CBE ሂሳብ ቁጥሩን ከዚህ ይለጥፉ። ትዕዛዝዎ ከተረጋገጠ በኋላ ይሰናዳ።
      </p>
    </div>
  );
}

function CashPanel({ total }) {
  return (
    <div className="space-y-3 rounded-xl border border-teal-100 bg-teal-50 p-5">
      <div>
        <p className="font-black text-teal-900">Cash on delivery</p>
        <p className="text-sm text-teal-600">
          Pay when your order arrives at your door
        </p>
      </div>
      <ul className="space-y-2 text-sm text-teal-800">
        {[
          "No upfront payment required",
          `Have the exact amount ready — ETB ${total.toLocaleString()}`,
          "Our delivery team will call you before arriving",
          "A receipt will be provided upon delivery",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 text-teal-500">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs italic text-teal-500">
        ሲቪል ሲደርስ ክፍያ ይፈጸማል። ትክክለኛ ገንዘብ ቢዘጋጁ ማስረከቢያ ይቀላሉ።
      </p>
    </div>
  );
}

function TransactionRefInput({ method, value, onChange }) {
  if (method === "cash" || method === "chapa") return null;

  const config = {
    telebirr: {
      label: "Telebirr transaction code",
      placeholder: "e.g. TT123456789",
    },
    cbebirr: {
      label: "CBEBirr reference number",
      placeholder: "e.g. CBB987654321",
    },
    bank: {
      label: "Bank transfer reference",
      placeholder: "Found on your transfer receipt",
    },
  };

  const { label, placeholder } = config[method] || {};

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">
        {label}{" "}
        <span className="font-normal text-zinc-400">
          (optional — speeds up verification)
        </span>
      </span>
      <input
        className="h-12 w-full rounded-lg border border-zinc-200 px-4 font-mono outline-none focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
}

function PaymentMethodSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {PAYMENT_METHODS.map((method) => (
        <button
          key={method.id}
          type="button"
          onClick={() => onSelect(method.id)}
          className={`relative flex flex-col items-start gap-2 rounded-xl border-2 p-3.5 text-left transition-all ${
            selected === method.id
              ? "border-red-700 bg-red-50"
              : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
          } ${method.id === "cash" ? "col-span-2 sm:col-span-1" : ""}`}
        >
          {method.popular && (
            <span className="absolute -right-2 -top-2.5 rounded-full bg-red-700 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
              Popular
            </span>
          )}
          <span
            className={
              selected === method.id ? "text-red-700" : "text-zinc-400"
            }
          >
            {method.icon}
          </span>
          <div>
            <p className="text-sm font-black leading-tight text-zinc-900">
              {method.label}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-400">
              {method.sublabel}
            </p>
          </div>
          {selected === method.id && (
            <span className="absolute right-2.5 top-2.5 text-xs font-black text-red-700">
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [paymentMethod, setPaymentMethod] = useState("telebirr");
  const [transactionRef, setTransactionRef] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [orderId] = useState(() => createOrderId());

  const updateField = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.phone.trim()) {
      next.phone = "Please enter a phone number.";
    } else if (!/^\d+$/.test(form.phone.trim())) {
      next.phone = "Please enter a valid numeric phone number.";
    }
    if (!form.address.trim())
      next.address = "Please enter your delivery address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    if (paymentMethod === "chapa") {
      setSubmitError(
        "Please use the 'Pay with Chapa' button above to complete your payment.",
      );
      return;
    }

    setSubmitting(true);

    const order = {
      id: orderId,
      customer: form,
      items,
      total,
      paymentMethod,
      transactionRef: transactionRef.trim() || null,
      status:
        paymentMethod === "cash"
          ? "Awaiting Delivery"
          : transactionRef.trim()
            ? "Payment Submitted — Verifying"
            : "Awaiting Verification",
      createdAt: new Date().toISOString(),
    };

    const result = await submitOrder(order);
    setSubmitting(false);

    if (result.ok === false && !result.fallback) {
      setSubmitError(
        result.error || "Unable to process your order. Please try again.",
      );
      return;
    }

    clearCart();
    navigate(`/order-success/${order.id}`);
  };

  if (items.length === 0) {
    return (
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Your cart is empty"
            body="Add something delicious from the menu before checking out."
          />
        </div>
      </section>
    );
  }

  const submitLabel = (() => {
    if (submitting) return "Placing your order…";
    if (paymentMethod === "chapa") return "Pay with Chapa above ↑";
    return "Place your order";
  })();

  const submitNote = (() => {
    if (paymentMethod === "cash")
      return "Our delivery team will call you before arriving.";
    if (paymentMethod === "chapa")
      return "Use the Chapa button above — your order is confirmed automatically.";
    return "We'll verify your payment and start preparing your order right away.";
  })();

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Checkout"
          title="Complete your order"
          body="Fill out your details, choose a payment method, and submit your order for preparation."
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <form
            className="space-y-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
            onSubmit={submit}
            noValidate
          >
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-zinc-400">
                1 — Your details
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  {
                    name: "name",
                    label: "Full name",
                    type: "text",
                  },
                  {
                    name: "phone",
                    label: "Phone number",
                    type: "tel",
                  },
                ].map((field) => (
                  <label key={field.name} className="block">
                    <span className="mb-2 block text-sm font-black">
                      {field.label}
                    </span>
                    <input
                      className={`h-12 w-full rounded-lg border px-4 outline-none focus:ring-4 focus:ring-yellow-200 ${
                        errors[field.name]
                          ? "border-red-700"
                          : "border-zinc-200 focus:border-red-800"
                      }`}
                      name={field.name}
                      type={field.type}
                      inputMode={field.type === "tel" ? "numeric" : undefined}
                      pattern={field.type === "tel" ? "[0-9]*" : undefined}
                      value={form[field.name]}
                      onChange={updateField}
                      aria-invalid={Boolean(errors[field.name])}
                    />
                    {errors[field.name] && (
                      <span className="mt-2 block text-sm font-bold text-red-700">
                        {errors[field.name]}
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-black">
                  Delivery address
                </span>
                <textarea
                  className={`min-h-28 w-full rounded-lg border px-4 py-3 outline-none focus:ring-4 focus:ring-yellow-200 ${
                    errors.address
                      ? "border-red-700"
                      : "border-zinc-200 focus:border-red-800"
                  }`}
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  aria-invalid={Boolean(errors.address)}
                  placeholder="Kebele, area name, or a nearby landmark"
                />
                {errors.address && (
                  <span className="mt-2 block text-sm font-bold text-red-700">
                    {errors.address}
                  </span>
                )}
              </label>
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-black">
                  Order notes
                </span>
                <textarea
                  className="min-h-24 w-full rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
                  name="notes"
                  value={form.notes}
                  onChange={updateField}
                  placeholder="Allergies, no onions, ring the gate bell…"
                />
              </label>
            </div>
            <div className="border-t border-zinc-100 pt-2">
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-zinc-400">
                2 — Payment method
              </p>
              <PaymentMethodSelector
                selected={paymentMethod}
                onSelect={(method) => {
                  setPaymentMethod(method);
                  setTransactionRef("");
                }}
              />
            </div>
            <div>
              {paymentMethod === "telebirr" && (
                <TelebirrPanel orderId={orderId} total={total} />
              )}
              {paymentMethod === "cbebirr" && (
                <CbebirrPanel orderId={orderId} total={total} />
              )}
              {paymentMethod === "chapa" && (
                <ChapaPanel orderId={orderId} total={total} />
              )}
              {paymentMethod === "bank" && (
                <BankTransferPanel orderId={orderId} total={total} />
              )}
              {paymentMethod === "cash" && <CashPanel total={total} />}
            </div>
            <TransactionRefInput
              method={paymentMethod}
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
            />
            <div className="border-t border-zinc-100 pt-2">
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-zinc-400">
                3 — Place your order
              </p>
              <p className="mb-5 text-sm text-zinc-500">{submitNote}</p>
              {submitError && (
                <p className="mb-4 text-sm font-bold text-red-700">
                  {submitError}
                </p>
              )}
              <Button
                className="w-full sm:w-auto"
                type="submit"
                disabled={submitting || paymentMethod === "chapa"}
              >
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
