import { test, expect, type APIRequestContext, type Page } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { randomUUID } from "node:crypto";

const local = { ...(existsSync("apps/backend/.env") ? parseEnv(readFileSync("apps/backend/.env", "utf8")) : {}), ...process.env };
const api = process.env.E2E_API_URL ?? "http://localhost:3001";
const email = process.env.E2E_ADMIN_EMAIL ?? local.ADMIN_EMAIL!;
const senha = process.env.E2E_ADMIN_PASSWORD ?? local.ADMIN_PASSWORD!;
const image = { name: "capa.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII=", "base64") };

function samplePdf() {
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 300] /Resources << >> /Contents 4 0 R >>", "<< /Length 0 >>\nstream\n\nendstream"];
  let output = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(output)); output += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const start = Buffer.byteLength(output);
  output += `xref\n0 5\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return { name: "edicao.pdf", mimeType: "application/pdf", buffer: Buffer.from(output) };
}
const pdf = samplePdf();

async function auth(request: APIRequestContext) {
  const response = await request.post(`${api}/auth`, { data: { email, senha } });
  expect(response.ok()).toBeTruthy();
  return { Authorization: `Bearer ${(await response.json()).token}` };
}
async function enter(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(senha);
  await page.getByRole("button", { name: "Aceder ao Painel" }).click();
  await expect(page.getByRole("heading", { name: "Painel Editorial" })).toBeVisible();
}

test("edições com tag textual, edição de matérias e PDF obrigatório são persistidos pela API", async ({ request }) => {
  const headers = await auth(request);
  const suffix = randomUUID();
  const records: [string, string][] = [];
  try {
    const editions = [];
    for (const index of [1, 2]) {
      const response = await request.post(`${api}/edicoes`, { headers, multipart: { titulo: `Edição integração ${suffix}-${index}`, numeroTag: `Especial ${suffix}-${index}`, capa: image, edicaoPdf: pdf } });
      expect(response.status()).toBe(201);
      const { edicao } = await response.json(); editions.push(edicao); records.unshift(["edicoes", edicao.id]);
      expect(edicao.numeroTag).toBe(`Especial ${suffix}-${index}`);
      expect((await request.get(edicao.pdfUrl)).status()).toBe(200);
    }
    const withoutPdf = await request.post(`${api}/revistas`, { headers, multipart: { titulo: "Sem PDF", edicaoId: editions[0].id, conteudo_html: "<p>Texto</p>", imagemDestaque: image } });
    expect(withoutPdf.status()).toBe(400);
    const created = await request.post(`${api}/revistas`, { headers, multipart: { titulo: `Matéria ${suffix}`, edicaoId: editions[0].id, autor: "Autoria inicial", conteudo_html: "<p>Conteúdo inicial.</p>", imagemDestaque: image, revistaPdf: pdf } });
    expect(created.status()).toBe(201);
    const { revista } = await created.json(); records.unshift(["revistas", revista.id]);
    const updated = await request.put(`${api}/revistas/${revista.id}`, { headers, multipart: { titulo: `Matéria editada ${suffix}`, edicaoId: editions[1].id, autor: "Autoria atualizada", conteudo_html: '<p>Conteúdo atualizado.</p><iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"></iframe><iframe src="https://malicioso.example/embed/1"></iframe>' } });
    expect(updated.ok()).toBeTruthy();
    const detail = (await (await request.get(`${api}/revistas/${revista.id}`)).json()).revista;
    expect(detail.edicaoId).toBe(editions[1].id);
    expect(detail.autores.map((author: { nome: string }) => author.nome)).toEqual(["Autoria atualizada"]);
    expect(detail.pdfUrl).toBe(revista.pdfUrl);
    expect(detail.imagemDestaque).toBe(revista.imagemDestaque);
    expect(detail.conteudo_html).toContain("youtube-nocookie.com");
    expect(detail.conteudo_html).not.toContain("malicioso.example");
    const previous = await (await request.get(`${api}/edicoes/${editions[0].id}`)).json();
    expect(previous.edicao.revistas).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: revista.id })]));
    const search = await (await request.get(`${api}/busca`, { params: { q: suffix } })).json();
    expect(search.resultados).toEqual(expect.arrayContaining([expect.objectContaining({ id: revista.id, tipo: "materia" })]));
  } finally { for (const [endpoint, id] of records) await request.delete(`${api}/${endpoint}/${id}`, { headers }); }
});

test("painel edita conteúdo, buscas e leitor PDF funcionam com teclado e no celular", async ({ page, request }) => {
  const headers = await auth(request);
  const suffix = randomUUID().slice(0, 8);
  const records: [string, string][] = [];
  try {
    const editions = [];
    for (const index of [1, 2, 3, 4, 5]) {
      const response = await request.post(`${api}/edicoes`, { headers, multipart: { titulo: `Acervo ${suffix}-${index}`, numeroTag: `Especial ${suffix}-${index}`, capa: image, edicaoPdf: pdf } });
      expect(response.status()).toBe(201);
      const { edicao } = await response.json(); editions.push(edicao); records.unshift(["edicoes", edicao.id]);
    }
    const newMateria = await request.post(`${api}/revistas`, { headers, multipart: { titulo: `Matéria ${suffix}`, edicaoId: editions[0].id, autor: "Autoria original", conteudo_html: "<p>Texto antes da edição.</p>", imagemDestaque: image, revistaPdf: pdf } });
    expect(newMateria.status()).toBe(201);
    const materia = (await newMateria.json()).revista; records.unshift(["revistas", materia.id]);
    const blog = (await (await request.post(`${api}/blogs`, { headers, data: { titulo: `Ensaio ${suffix}`, conteudoHtml: "<p>Ensaio original.</p>" } })).json()).blog; records.unshift(["blogs", blog.id]);
    const projeto = (await (await request.post(`${api}/projetos`, { headers, data: { titulo: `Projeto ${suffix}`, conteudoHtml: "<p>Projeto original.</p>", imagemUrl: editions[0].capaUrl } })).json()).projeto; records.unshift(["projetos", projeto.id]);
    await enter(page);
    await page.getByRole("button", { name: "MATÉRIAS DAS EDIÇÕES", exact: true }).click();
    await page.getByRole("row").filter({ hasText: `Matéria ${suffix}` }).getByRole("button", { name: /^Editar / }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByLabel("TÍTULO", { exact: true })).toHaveValue(`Matéria ${suffix}`);
    await dialog.getByLabel("AUTOR (CRÉDITOS)").fill("Autoria revisada");
    await dialog.getByLabel("VINCULAR À EDIÇÃO").selectOption(editions[1].id);
    await dialog.locator('[contenteditable="true"]').fill("Texto revisado pelo painel.");
    await dialog.getByRole("button", { name: "GUARDAR ALTERAÇÕES", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole("row").filter({ hasText: `Matéria ${suffix}` })).toContainText("Autoria revisada");
    const detail = (await (await request.get(`${api}/revistas/${materia.id}`)).json()).revista;
    expect(detail.pdfUrl).toBe(materia.pdfUrl); expect(detail.edicaoId).toBe(editions[1].id);
    for (const [tab, title, body, endpoint, id] of [["BLOG", `Ensaio ${suffix}`, "Ensaio atualizado no painel.", "blogs", blog.id], ["PROJETOS", `Projeto ${suffix}`, "Projeto atualizado no painel.", "projetos", projeto.id]]) {
      await page.getByRole("button", { name: tab, exact: true }).click();
      await page.getByRole("row").filter({ hasText: title }).getByRole("button", { name: /^Editar / }).click();
      await expect(dialog.getByLabel("TÍTULO", { exact: true })).toHaveValue(title);
      await dialog.locator('[contenteditable="true"]').fill(body);
      if (tab === "BLOG") {
        page.once("dialog", prompt => prompt.accept("https://youtu.be/dQw4w9WgXcQ"));
        await dialog.getByRole("button", { name: "Inserir vídeo", exact: true }).click();
        await expect(dialog.locator("iframe")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
      }
      await dialog.getByRole("button", { name: "GUARDAR ALTERAÇÕES", exact: true }).click();
      await expect(dialog).not.toBeVisible();
      const result = await (await request.get(`${api}/${endpoint}/${id}`)).json();
      expect((result.blog ?? result.projeto).conteudoHtml).toContain(body);
    }
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Diorama", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: `Acervo ${suffix}-2`, exact: true })).toBeAttached();
    await page.getByRole("button", { name: /^EDIÇÕES/ }).click();
    await expect(page.getByRole("link", { name: `Acervo ${suffix}-2`, exact: true })).toBeVisible();
    await page.goto("/edicoes");
    await page.getByLabel("Pesquisar no acervo").fill(`Especial ${suffix}-2`);
    await page.getByRole("button", { name: "Pesquisar", exact: true }).click();
    await expect(page.getByRole("main").getByRole("link", { name: /^Ler Acervo / })).toHaveCount(1);
    await page.getByRole("link", { name: `Ler Acervo ${suffix}-2` }).click();
    await expect(page).toHaveURL(new RegExp(`/edicoes/${editions[1].id}$`));
    await page.getByLabel("Pesquisar no acervo").fill("Autoria revisada");
    await page.getByRole("button", { name: "Pesquisar", exact: true }).click();
    await expect(page.getByRole("main").getByRole("listitem")).toHaveCount(1);
    await page.getByRole("button", { name: "Ler edição completa", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog").locator("iframe")).toHaveAttribute("src", editions[1].pdfUrl);
    await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible();
    await page.getByRole("button", { name: "Buscar no acervo", exact: true }).click();
    await expect(page.getByLabel("Busca no acervo", { exact: true })).toBeFocused();
    await page.getByLabel("Busca no acervo", { exact: true }).fill(suffix);
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    await expect(page.getByRole("main")).toContainText(`Matéria ${suffix}`);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: test.info().outputPath("busca-celular.png"), fullPage: true });
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Menu da Diorama" })).toBeVisible();
    await page.getByRole("navigation", { name: "Navegação do celular" }).getByRole("link", { name: "Revista", exact: true }).click();
    await expect(page).toHaveURL(/\/edicoes$/);
    await page.goto("/pages/dashboard");
    await expect(page.getByRole("heading", { name: "Painel Editorial" })).toBeVisible();
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const tab of ["EDIÇÕES BASE", "MATÉRIAS DAS EDIÇÕES", "BLOG", "PROJETOS", "SOBRE", "NEWSLETTER"]) {
        await page.getByRole("button", { name: tab, exact: true }).click();
        await expect(page.getByRole("button", { name: tab, exact: true })).toHaveAttribute("aria-current", "page");
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    for (const [tab, button] of [["EDIÇÕES BASE", "+ NOVA EDIÇÃO"], ["MATÉRIAS DAS EDIÇÕES", "+ NOVA MATÉRIA"], ["BLOG", "+ NOVO ENSAIO"], ["PROJETOS", "+ NOVO PROJETO"], ["NEWSLETTER", "+ NOVA CAMPANHA"]]) {
      await page.getByRole("button", { name: tab, exact: true }).click();
      const trigger = page.getByRole("button", { name: button, exact: true });
      await trigger.click();
      await expect(dialog.getByRole("button", { name: "Fechar", exact: true })).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBeTruthy();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }
  } finally { for (const [endpoint, id] of records) await request.delete(`${api}/${endpoint}/${id}`, { headers }); }
});

test("newsletter do rodapé envia via SMTP local, cancela e evita envios duplicados", async ({ page, request }) => {
  test.skip(process.env.E2E_SMTP_TESTS !== "1", "Habilite somente com o Mailpit local ativo.");
  expect(["127.0.0.1", "localhost"]).toContain(local.SMTP_HOST);
  expect(local.SMTP_PORT).toBe("1025");
  const smtp = "http://localhost:8025";
  expect((await request.get(`${smtp}/api/v1/info`)).ok()).toBeTruthy();
  const suffix = randomUUID();
  const recipient = `rodape-${suffix}@example.test`;
  await page.goto("/newsletter");
  const footer = page.getByRole("contentinfo");
  await footer.getByLabel("Seu email").fill(recipient);
  await footer.getByRole("button", { name: "Cadastrar", exact: true }).click();
  await expect(footer.getByRole("status")).toHaveText("Inscrição recebida com sucesso!");
  await enter(page);
  await page.getByRole("button", { name: "NEWSLETTER", exact: true }).click();
  await page.getByRole("button", { name: "+ NOVA CAMPANHA", exact: true }).click();
  const dialog = page.getByRole("dialog");
  const subject = `Campanha local ${suffix}`;
  await dialog.getByLabel("ASSUNTO DO E-MAIL").fill(subject);
  await dialog.locator('[contenteditable="true"]').fill("Conteúdo da newsletter de teste local.");
  await dialog.getByRole("button", { name: "GUARDAR RASCUNHO", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page.getByRole("listitem").filter({ hasText: subject }).getByRole("button", { name: "REVISAR CAMPANHA", exact: true }).click();
  await dialog.getByRole("button", { name: "CONFIRMAR ENVIO", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  const all = (await (await request.get(`${smtp}/api/v1/messages`)).json()).messages;
  const delivery = all.find((message: { Subject: string; To: { Address: string }[] }) => message.Subject === subject && message.To.some(to => to.Address === recipient));
  expect(delivery).toBeTruthy();
  const message = await (await request.get(`${smtp}/api/v1/message/${delivery.ID}`)).json();
  const link = /href="([^"]*\/newsletter\/cancelar\?token=[^"]+)"/.exec(message.HTML)?.[1];
  expect(link).toBeTruthy();
  await page.goto(link!);
  await page.getByRole("button", { name: "Confirmar cancelamento", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Sua inscrição foi cancelada");
  const headers = await auth(request);
  const campaigns = (await (await request.get(`${api}/newsletter/campanhas`, { headers })).json()).campanhas;
  const first = campaigns.find((campaign: { assunto: string }) => campaign.assunto === subject);
  expect((await request.post(`${api}/newsletter/campanhas/${first.id}/enviar`, { headers })).ok()).toBeTruthy();
  const afterRetry = (await (await request.get(`${smtp}/api/v1/messages`)).json()).messages;
  expect(afterRetry.filter((item: { Subject: string; To: { Address: string }[] }) => item.Subject === subject && item.To.some(to => to.Address === recipient))).toHaveLength(1);
  const nextSubject = `Após cancelamento ${suffix}`;
  const next = await (await request.post(`${api}/newsletter/campanhas`, { headers, data: { assunto: nextSubject, conteudoHtml: "<p>Segunda campanha local.</p>" } })).json();
  expect((await request.post(`${api}/newsletter/campanhas/${next.campanha.id}/enviar`, { headers })).ok()).toBeTruthy();
  const afterCancel = (await (await request.get(`${smtp}/api/v1/messages`)).json()).messages;
  expect(afterCancel.filter((item: { Subject: string; To: { Address: string }[] }) => item.Subject === nextSubject && item.To.some(to => to.Address === recipient))).toHaveLength(0);
});
