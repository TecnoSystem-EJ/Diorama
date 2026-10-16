import { test, expect, type Page } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { randomUUID } from "node:crypto";

const env = { ...(existsSync("apps/backend/.env") ? parseEnv(readFileSync("apps/backend/.env", "utf8")) : {}), ...process.env };
const api = process.env.E2E_API_URL ?? "http://localhost:3001";
const email = process.env.E2E_ADMIN_EMAIL ?? env.ADMIN_EMAIL!;
const senha = process.env.E2E_ADMIN_PASSWORD ?? env.ADMIN_PASSWORD!;
const image = { name: "teste.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1ioAAAAASUVORK5CYII=", "base64") };
const pdf = { name: "teste.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF") };

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("E-mail", { exact: true }).fill(email);
  await page.getByLabel("Senha", { exact: true }).fill(senha);
  await page.getByRole("button", { name: "Aceder ao Painel" }).click();
  await expect(page.getByRole("heading", { name: "Painel Editorial" })).toBeVisible();
}

test("API protege operações, omite hashes e rejeita usuários desativados", async ({ request }) => {
  expect((await request.get(`${api}/health`)).ok()).toBeTruthy();
  for (const endpoint of ["/edicoes", "/revistas", "/usuarios", "/blogs", "/projetos"]) {
    expect((await request.post(`${api}${endpoint}`, { data: {} })).status()).toBe(401);
  }
  expect((await request.put(`${api}/sobre-nos`, { data: {} })).status()).toBe(401);
  expect((await request.get(`${api}/usuarios`)).status()).toBe(401);
  expect((await request.post(`${api}/auth`, { data: { email, senha: "incorreta" } })).status()).toBe(400);
  const auth = await request.post(`${api}/auth`, { data: { email, senha } });
  expect(auth.ok()).toBeTruthy();
  const { token } = await auth.json();
  const headers = { Authorization: `Bearer ${token}` };
  const me = await (await request.get(`${api}/auth/me`, { headers })).json();
  expect(typeof me.user.id).toBe("number");
  expect(me.user.role).toBe("ADMIN");
  const users = await (await request.get(`${api}/usuarios`, { headers })).json();
  expect(JSON.stringify(users)).not.toContain("senhaHash");
  const authorEmail = `teste-${randomUUID()}@example.test`;
  let authorId: number | undefined;
  try {
    const created = await request.post(`${api}/usuarios`, { headers, data: { username: "Teste E2E", email: authorEmail, senha: "Teste-E2E-123!", role: "autor" } });
    expect(created.status()).toBe(201);
    const { usuario } = await created.json(); authorId = usuario.id;
    expect(usuario).not.toHaveProperty("senhaHash");
    const updated = await request.put(`${api}/usuarios/${authorId}`, { headers, data: { senha: "Nova-senha-E2E-123!" } });
    expect(updated.ok()).toBeTruthy();
    const authorLogin = await request.post(`${api}/auth`, { data: { email: authorEmail, senha: "Nova-senha-E2E-123!" } });
    expect(authorLogin.ok()).toBeTruthy();
    const authorToken = (await authorLogin.json()).token;
    expect((await request.post(`${api}/blogs`, { headers: { Authorization: `Bearer ${authorToken}` }, data: {} })).status()).toBe(403);
    await request.delete(`${api}/usuarios/${authorId}`, { headers });
    expect((await request.get(`${api}/auth/me`, { headers: { Authorization: `Bearer ${authorToken}` } })).status()).toBe(401);
    expect((await request.post(`${api}/auth`, { data: { email: authorEmail, senha: "Nova-senha-E2E-123!" } })).status()).toBe(400);
    const sanitized = await request.post(`${api}/blogs`, { headers, data: { titulo: `Teste sanitização ${randomUUID()}`, conteudoHtml: '<p>Texto seguro</p><script>alert(1)</script><img src="x" onerror="alert(1)">' } });
    expect(sanitized.status()).toBe(201);
    const { blog } = await sanitized.json();
    expect(blog.conteudoHtml).not.toMatch(/script|onerror/);
    await request.delete(`${api}/blogs/${blog.id}`, { headers });
  } finally { if (authorId) await request.delete(`${api}/usuarios/${authorId}`, { headers }); }
});

test("painel publica, edita e remove conteúdo com uploads e persistência real", async ({ page, request, context }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const suffix = String(Date.now());
  const title = `Edição teste ${suffix}`;
  const editedTitle = `${title} editada`;
  const materiaTitle = `Matéria teste ${suffix}`;
  const blogTitle = `Ensaio teste ${suffix}`;
  const projectTitle = `Projeto teste ${suffix}`;
  let edicaoId = "", materiaId = "", blogId = "", projetoId = "";
  const auth = await (await request.post(`${api}/auth`, { data: { email, senha } })).json();
  const headers = { Authorization: `Bearer ${auth.token}` };
  const originalSobre = await (await request.get(`${api}/sobre-nos`)).json();
  const publicPage = await context.newPage();
  try {
    await page.goto("/pages/dashboard");
    await expect(page).toHaveURL(/\/login$/);
    await login(page);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Painel Editorial" })).toBeVisible();
    await page.getByRole("button", { name: "+ NOVA EDIÇÃO", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("TÍTULO", { exact: true }).fill(title);
    await dialog.getByLabel("NÚMERO / TAG DA EDIÇÃO").fill(suffix);
    await dialog.getByLabel("IMAGEM DA CAPA").setInputFiles(image);
    await dialog.getByRole("button", { name: "GUARDAR REGISTRO" }).click();
    await expect(dialog).not.toBeVisible();
    let row = page.getByRole("row").filter({ hasText: title });
    await expect(row).toBeVisible();
    const editions = await (await request.get(`${api}/edicoes`)).json();
    const edicao = editions.edicoes.find((item: { titulo: string }) => item.titulo === title);
    edicaoId = edicao.id;
    expect((await request.get(edicao.capaUrl)).ok()).toBeTruthy();
    await row.getByRole("link", { name: "EDITAR" }).click();
    await page.getByLabel("TÍTULO", { exact: true }).fill(editedTitle);
    await page.getByRole("button", { name: "GUARDAR REGISTRO" }).click();
    await expect(page).toHaveURL(/\/pages\/dashboard$/);
    row = page.getByRole("row").filter({ hasText: editedTitle });
    await expect(row).toBeVisible();

    await page.getByRole("button", { name: "MATÉRIAS DAS EDIÇÕES", exact: true }).click();
    await page.getByRole("button", { name: "+ NOVA MATÉRIA", exact: true }).click();
    await dialog.getByLabel("VINCULAR À EDIÇÃO").selectOption(edicaoId);
    await dialog.getByLabel("TÍTULO", { exact: true }).fill(materiaTitle);
    await dialog.getByLabel("AUTOR (CRÉDITOS)").fill("Autoria E2E");
    await dialog.getByLabel("IMAGEM DE DESTAQUE").setInputFiles(image);
    await dialog.getByLabel("PDF DA MATÉRIA").setInputFiles(pdf);
    await dialog.locator('[contenteditable="true"]').fill("Conteúdo da matéria de integração.");
    await dialog.getByRole("button", { name: "CRIAR MATÉRIA", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole("row").filter({ hasText: materiaTitle })).toContainText("Autoria E2E");
    const materias = await (await request.get(`${api}/revistas`)).json();
    const materia = materias.revistas.find((item: { titulo: string }) => item.titulo === materiaTitle);
    materiaId = materia.id;
    expect((await request.get(materia.pdfUrl)).ok()).toBeTruthy();
    await publicPage.goto(`/edicoes/${edicaoId}`);
    await expect(publicPage.getByRole("button", { name: "Buscar no acervo", exact: true })).toBeEnabled();
    await expect(publicPage.getByRole("link", { name: new RegExp(materiaTitle) }).first()).toBeVisible();
    await publicPage.getByRole("link", { name: new RegExp(materiaTitle) }).first().click();
    await expect(publicPage).toHaveURL(new RegExp(`/materias/${materiaId}$`));
    await expect(publicPage.getByText("Conteúdo da matéria de integração.", { exact: true })).toBeVisible();
    await expect(publicPage.getByRole("link", { name: /Abrir PDF/ }).first()).toHaveAttribute("href", materia.pdfUrl);

    await page.getByRole("button", { name: "BLOG", exact: true }).click();
    await page.getByRole("button", { name: "+ NOVO ENSAIO", exact: true }).click();
    await dialog.getByLabel("TÍTULO", { exact: true }).fill(blogTitle);
    await dialog.locator('[contenteditable="true"]').fill("Conteúdo do ensaio de integração.");
    await dialog.getByRole("button", { name: "CRIAR ENSAIO", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole("row").filter({ hasText: blogTitle })).toBeVisible();
    const blogs = await (await request.get(`${api}/blogs`)).json();
    blogId = blogs.blogs.find((item: { titulo: string }) => item.titulo === blogTitle).id;
    await publicPage.goto("/blog");
    await expect(publicPage.getByRole("button", { name: "Buscar no acervo", exact: true })).toBeEnabled();
    await publicPage.getByRole("article").filter({ hasText: blogTitle }).getByRole("link", { name: "Ler artigo" }).click();
    await expect(publicPage.getByText("Conteúdo do ensaio de integração.", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "PROJETOS", exact: true }).click();
    await page.getByRole("button", { name: "+ NOVO PROJETO", exact: true }).click();
    await dialog.getByLabel("TÍTULO", { exact: true }).fill(projectTitle);
    await dialog.getByLabel("URL DA IMAGEM").fill(edicao.capaUrl);
    await dialog.locator('[contenteditable="true"]').fill("Conteúdo do projeto de integração.");
    await dialog.getByRole("button", { name: "CRIAR PROJETO", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole("row").filter({ hasText: projectTitle })).toBeVisible();
    const projetos = await (await request.get(`${api}/projetos`)).json();
    projetoId = projetos.projetos.find((item: { titulo: string }) => item.titulo === projectTitle).id;
    await publicPage.goto("/projetos");
    await expect(publicPage.getByRole("button", { name: "Buscar no acervo", exact: true })).toBeEnabled();
    await publicPage.getByRole("link", { name: new RegExp(projectTitle) }).first().click();
    await expect(publicPage.getByText("Conteúdo do projeto de integração.", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "SOBRE", exact: true }).click();
    const save = page.getByRole("button", { name: "GUARDAR ALTERAÇÕES", exact: true });
    await expect(save).toBeEnabled();
    await page.locator('[contenteditable="true"]').fill(`Missão Diorama ${suffix}`);
    await save.click();
    await expect(page.getByRole("status")).toHaveText("Alterações salvas.");
    await publicPage.goto("/about");
    await expect(publicPage.getByText(`Missão Diorama ${suffix}`, { exact: true })).toBeVisible();
    await page.reload();
    await page.getByRole("button", { name: "SOBRE", exact: true }).click();
    await expect(page.locator('[contenteditable="true"]')).toContainText(`Missão Diorama ${suffix}`);

    page.on("dialog", dialog => dialog.accept());
    for (const [tab, itemTitle, endpoint, id] of [
      ["BLOG", blogTitle, "blogs", blogId], ["PROJETOS", projectTitle, "projetos", projetoId],
      ["MATÉRIAS DAS EDIÇÕES", materiaTitle, "revistas", materiaId], ["EDIÇÕES BASE", editedTitle, "edicoes", edicaoId],
    ]) {
      await page.getByRole("button", { name: tab, exact: true }).click();
      const item = page.getByRole("row").filter({ hasText: itemTitle });
      await item.getByRole("button", { name: /^Remover / }).click();
      await expect(item).not.toBeVisible();
      expect((await request.get(`${api}/${endpoint}/${id}`)).status()).toBe(404);
    }
    await page.getByRole("button", { name: "SAIR", exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    expect(await page.evaluate(() => localStorage.getItem("TOKEN"))).toBeNull();
    expect(errors).toEqual([]);
  } finally {
    for (const [endpoint, id] of [["revistas", materiaId], ["edicoes", edicaoId], ["blogs", blogId], ["projetos", projetoId]]) {
      if (id) await request.delete(`${api}/${endpoint}/${id}`, { headers });
    }
    await request.put(`${api}/sobre-nos`, { headers, data: { textoCompletoHtml: originalSobre.textoCompletoHtml || "<p>A Diorama é uma plataforma editorial sobre cultura e natureza.</p>" } });
    await publicPage.close();
  }
});

test("newsletter confirma inscrição e navegação pública funciona no celular", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("main").getByLabel("Seu email").fill(`newsletter-${randomUUID()}@example.test`);
  await page.getByRole("main").getByRole("button", { name: "Receber", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Inscrição recebida com sucesso!");
  await page.getByRole("link", { name: "FAZER LOGIN", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
});
