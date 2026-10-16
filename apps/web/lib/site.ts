function publicHttpUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try { const parsed = new URL(value); return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : undefined; }
  catch { return undefined; }
}

const configuredEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
const configuredUrl = publicHttpUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const site = {
  name: "Diorama",
  description: "Uma plataforma editorial sobre cultura, natureza e novas formas de imaginar futuros. Leia edições, matérias, ensaios e projetos da Diorama.",
  url: configuredUrl ? new URL(configuredUrl).origin : "http://localhost:3000",
  isConfigured: Boolean(configuredUrl),
  email: configuredEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuredEmail) ? configuredEmail : undefined,
  instagram: publicHttpUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  spotify: publicHttpUrl(process.env.NEXT_PUBLIC_SPOTIFY_URL),
  issn: process.env.NEXT_PUBLIC_ISSN?.trim(),
};
