"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { createCallbackSchema, type CallbackFormInput } from "@dentaliva/lib/forms/callback-schema";
import { Button } from "@dentaliva/ui";
import { Text } from "@dentaliva/ui";

import { uiString } from "../src/ui-strings";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// PRF-5: saf modül sabitleri — her render'da yeni resolver/defaultValues
// üretimi yerine tek kez kurulur. INT-4: şema + etiketler aktif sitenin
// dilinden gelir (NEXT_PUBLIC_SITE_ID build'de literal inline edilir —
// tr/en paketlerinin öbürürü bundle'dan elenir).
const formLocale =
  process.env.NEXT_PUBLIC_SITE_ID === "eu"
    ? "en"
    : process.env.NEXT_PUBLIC_SITE_ID === "nl"
      ? "nl"
      : "tr";
const callbackFormSchema = createCallbackSchema(formLocale);
const resolver = zodResolver(callbackFormSchema);
const emptyValues: CallbackFormInput = {
  name: "",
  phone: "",
  preferredTime: "",
  kvkkConsent: false,
  website: "",
  turnstileToken: "",
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string | undefined;
      remove: (id?: string) => void;
    };
  }
}

type SubmitState = "idle" | "success" | "error";

export function CallbackForm({ endpoint = "/api/callback" }: { endpoint?: string }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CallbackFormInput>({
    resolver,
    defaultValues: emptyValues,
  });

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverError, setServerError] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  // Turnstile yalnızca site key tanımlıysa yüklenir; test/dev ortamında atlanır.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => {
      if (widgetRef.current) {
        widgetIdRef.current = window.turnstile?.render(widgetRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => setValue("turnstileToken", token),
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      try {
        window.turnstile?.remove(widgetIdRef.current);
      } catch {
        // widget zaten kaldırılmış
      }
      // PRF-5: enjekte edilen script'i de kaldır — StrictMode çift
      // çağrımda <head> tekrar etmesin.
      script.remove();
    };
  }, [setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setServerError(body.error ?? uiString("submitErrorFallback"));
        setSubmitState("error");
        return;
      }
      setSubmitState("success");
      reset(emptyValues);
    } catch {
      setServerError(uiString("connectionError"));
      setSubmitState("error");
    }
  });

  if (submitState === "success") {
    return (
      <div className="border border-[var(--dvn-line-gold)] bg-white p-8 text-center" role="status">
        <Text size="lg" className="font-semibold">
          {uiString("successMessage")}
        </Text>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        void onSubmit(event);
      }}
      noValidate
      className="space-y-5 font-sans"
    >
      {/* Honeypot: ekran okuyucular ve insanlar için görünmez. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div>
        <label htmlFor="cb-name" className="mb-1 block text-sm font-semibold text-navy">
          {uiString("nameLabel")}
        </label>
        <input
          id="cb-name"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "cb-name-error" : undefined}
          className="w-full border border-[var(--dvn-line-soft)] bg-white px-4 py-3 text-ink focus:border-gold focus:outline-2 focus:outline-offset-0 focus:outline-gold aria-[invalid=true]:border-red-600"
          {...register("name")}
        />
        {errors.name ? (
          <p id="cb-name-error" role="alert" className="mt-1 text-sm font-medium text-red-600">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cb-phone" className="mb-1 block text-sm font-semibold text-navy">
          {uiString("phoneLabel")}
        </label>
        <input
          id="cb-phone"
          type="tel"
          autoComplete="tel"
          placeholder={uiString("phonePlaceholder")}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "cb-phone-error" : undefined}
          className="w-full border border-[var(--dvn-line-soft)] bg-white px-4 py-3 text-ink focus:border-gold focus:outline-2 focus:outline-offset-0 focus:outline-gold aria-[invalid=true]:border-red-600"
          {...register("phone")}
        />
        {errors.phone ? (
          <p id="cb-phone-error" role="alert" className="mt-1 text-sm font-medium text-red-600">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cb-time" className="mb-1 block text-sm font-semibold text-navy">
          {uiString("preferredTimeLabel")}
        </label>
        <input
          id="cb-time"
          type="text"
          className="w-full border border-[var(--dvn-line-soft)] bg-white px-4 py-3 text-ink focus:border-gold focus:outline-2 focus:outline-offset-0 focus:outline-gold"
          {...register("preferredTime")}
        />
      </div>

      <div>
        <div ref={widgetRef} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input
            type="checkbox"
            aria-invalid={Boolean(errors.kvkkConsent)}
            aria-describedby={errors.kvkkConsent ? "cb-kvkk-error" : undefined}
            className="mt-0.5 size-5 accent-[var(--dvn-gold)]"
            {...register("kvkkConsent")}
          />
          <span>{uiString("consentLabel")}</span>
        </label>
        {errors.kvkkConsent ? (
          <p id="cb-kvkk-error" role="alert" className="mt-1 text-sm font-medium text-red-600">
            {errors.kvkkConsent.message}
          </p>
        ) : null}
      </div>

      {submitState === "error" && serverError ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? uiString("submitting") : uiString("submitCta")}
      </Button>
    </form>
  );
}
