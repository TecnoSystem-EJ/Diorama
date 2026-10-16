import { cleanHtml } from "../../utils/cleanHtml.js";

describe("HTML editorial", () => {
  it("mantém somente incorporações dos provedores aprovados", () => {
    for (const src of ["https://www.youtube.com/embed/Abcd1234", "https://www.youtube-nocookie.com/embed/Abcd1234", "https://player.vimeo.com/video/123456"]) {
      const result = cleanHtml(`<iframe src="${src}" onload="alert(1)"></iframe>`);
      expect(result).toContain(`src="${src}"`);
      expect(result).toContain('sandbox="allow-scripts allow-same-origin allow-presentation"');
      expect(result).not.toContain("onload");
    }
  });
  it.each(["https://evil.example/embed/Abcd1234", "https://www.youtube.com.evil.example/embed/Abcd1234", "http://www.youtube.com/embed/Abcd1234", "https://www.youtube.com/redirect?q=evil", "https://player.vimeo.com/anything", "javascript:alert(1)", "//www.youtube.com/embed/Abcd1234"])("remove iframe não permitido %s", (src) => {
    expect(cleanHtml(`<p>Texto</p><iframe src="${src}"></iframe>`)).toBe("<p>Texto</p>");
  });
  it("remove scripts, estilos perigosos e protocolos executáveis", () => {
    const result = cleanHtml('<script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(1)"><a href="javascript:alert(1)">Link</a>');
    expect(result).not.toMatch(/script|onerror|javascript/);
  });
});
