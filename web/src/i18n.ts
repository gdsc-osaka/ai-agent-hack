type Locales = "ja" | "en";
type DefaultLocale = "ja";

type I18n<T extends Record<string, unknown>> = {
  [key in Locales]: T;
};

const createI18n = <T extends Record<Locales, Record<string, unknown>>>(
  i18n: T & { [K in Locales]: T[DefaultLocale] }
): I18n<T[DefaultLocale]> => {
  return i18n;
};

export default createI18n({
  ja: {
    hello: "a",
  },
  en: {
    hello: "a",
  },
});
