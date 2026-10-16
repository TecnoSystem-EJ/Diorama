import sanitizeHtml from "sanitize-html";

function trustedVideo(source: string): boolean {
  try {
    const url = new URL(source);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
    return (["www.youtube.com", "www.youtube-nocookie.com"].includes(url.hostname) && /^\/embed\/[A-Za-z0-9_-]{6,}$/.test(url.pathname))
      || (url.hostname === "player.vimeo.com" && /^\/video\/\d+$/.test(url.pathname));
  } catch { return false; }
}

export function cleanHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "h1", "h2", "s", "u", "iframe"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      iframe: ["src", "title", "width", "height", "allowfullscreen", "loading", "referrerpolicy", "sandbox"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { iframe: ["https"] },
    exclusiveFilter: frame => frame.tag === "iframe" && !trustedVideo(frame.attribs.src ?? ""),
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      iframe: sanitizeHtml.simpleTransform("iframe", {
        title: "Vídeo incorporado", loading: "lazy", referrerpolicy: "strict-origin-when-cross-origin",
        sandbox: "allow-scripts allow-same-origin allow-presentation", allowfullscreen: "true",
      }),
    },
  });
}
