import { Node } from "@tiptap/react";

/** Convert public video links into the two supported, privacy-conscious players. */
export function videoEmbedUrl(input: string): string | null {
  try {
    const url = new URL(input);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.split("/")[1] ?? null;
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      id = url.pathname === "/watch" ? url.searchParams.get("v") : /^\/(?:embed|shorts)\/([^/]+)\/?$/.exec(url.pathname)?.[1] ?? null;
    }
    if (id && /^[\w-]{11}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const vimeoId = /^\/(?:video\/)?(\d+)\/?$/.exec(url.pathname)?.[1];
      if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
    }
  } catch { /* Unsupported or malformed URLs are never embedded. */ }
  return null;
}

export const VideoEmbed = Node.create({
  name: "videoEmbed",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() { return { src: { default: null } }; },
  parseHTML() {
    return [{
      tag: "iframe[src]",
      getAttrs: (element) => {
        const src = videoEmbedUrl(element.getAttribute("src") ?? "");
        return src ? { src } : false;
      },
    }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["iframe", {
      src: videoEmbedUrl(String(HTMLAttributes.src ?? "")) ?? "",
      title: "Vídeo incorporado",
      width: "560", height: "315", loading: "lazy",
      allow: "fullscreen; picture-in-picture",
      allowfullscreen: "true",
      referrerpolicy: "strict-origin-when-cross-origin",
      style: "max-width:100%;aspect-ratio:16/9;",
    }];
  },
});
