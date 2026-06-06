import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import OrderSummary from "../components/OrderSummary";
import SectionHeader from "../components/SectionHeader";
import { useCart } from "../context/CartContext";
import { createOrderId, submitOrder } from "../utils/orders";
import { useTranslation } from "../i18n";

const initialForm = {
  name: "",
  phone: "",
  address: "",
  notes: "",
  paymentMethod: "Cash",
};

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = t("checkout.errors.name");
    if (!form.phone.trim()) {
      nextErrors.phone = t("checkout.errors.phone");
    } else if (!/^\d+$/.test(form.phone.trim())) {
      nextErrors.phone =
        t("checkout.errors.phoneNumeric") || t("checkout.errors.phone");
    }
    if (!form.address.trim()) nextErrors.address = t("checkout.errors.address");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    const order = {
      id: createOrderId(),
      customer: form,
      items,
      total,
      paymentMethod: form.paymentMethod,
      status: "Awaiting Verification",
      createdAt: new Date().toISOString(),
    };

    const result = await submitOrder(order);
    setSubmitting(false);

    if (result.ok === false && !result.fallback) {
      setSubmitError(result.error || t("checkout.errors.submit"));
      return;
    }

    clearCart();
    navigate(`/success/${order.id}`);
  };

  if (items.length === 0) {
    return (
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title={t("checkout.emptyTitle")}
            body={t("checkout.emptyBody")}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={t("checkout.eyebrow")}
          title={t("checkout.title")}
          body={t("checkout.body")}
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <form
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            onSubmit={submit}
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  name: "name",
                  label: t("checkout.fields.name"),
                  type: "text",
                },
                {
                  name: "phone",

                  label: t("checkout.fields.phone"),

                  type: "tel",
                },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="mb-2 block text-sm font-black">
                    {field.label}
                  </span>
                  <input
                    className={`h-12 w-full rounded-lg border px-4 outline-none focus:ring-4 focus:ring-yellow-200 ${errors[field.name] ? "border-red-700" : "border-zinc-200 focus:border-red-800"}`}
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
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-black">
                  {t("checkout.fields.paymentMethod")}
                </span>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={updateField}
                  className="h-12 w-full rounded-lg border border-zinc-200 bg-white px-3 outline-none focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
                >
                  <option>{t("checkout.paymentOptions.cash")}</option>
                  <option>{t("checkout.paymentOptions.cbebirr")}</option>
                  <option>{t("checkout.paymentOptions.telebirr")}</option>
                </select>
              </label>
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-black">
                {t("checkout.fields.address")}
              </span>
              <textarea
                className={`min-h-28 w-full rounded-lg border px-4 py-3 outline-none focus:ring-4 focus:ring-yellow-200 ${errors.address ? "border-red-700" : "border-zinc-200 focus:border-red-800"}`}
                name="address"
                value={form.address}
                onChange={updateField}
                aria-invalid={Boolean(errors.address)}
              />
              {errors.address && (
                <span className="mt-2 block text-sm font-bold text-red-700">
                  {errors.address}
                </span>
              )}
            </label>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-black">
                {t("checkout.fields.notes")}
              </span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-red-800 focus:ring-4 focus:ring-yellow-200"
                name="notes"
                value={form.notes}
                onChange={updateField}
                placeholder={
                  t("checkout.notesPlaceholder") ||
                  "Allergies, landmarks, or delivery preferences"
                }
              />
            </label>
            {submitError && (
              <p className="mt-4 text-sm font-bold text-red-700">
                {submitError}
              </p>
            )}
            <Button
              className="mt-6 w-full sm:w-auto"
              type="submit"
              disabled={submitting}
            >
              {submitting ? t("checkout.placing") : t("checkout.placeOrder")}
            </Button>
          </form>
          <OrderSummary cta={false} />
        </div>
      </div>
    </section>
  );
}
