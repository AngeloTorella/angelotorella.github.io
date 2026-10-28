interface ImportMetaEnv {
  /** Formspree-compatible form endpoint. When unset, /contacto shows a mailto link instead. */
  readonly PUBLIC_FORM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
