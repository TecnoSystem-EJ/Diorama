"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createCampanha, fetchCampanhas, sendCampanha, type Campanha } from "../../../service/newsletterService";
import { CreateModal } from "../../ui/CreateModal";
import { RichTextEditor } from "../../ui/RichTextEditor";
import { SectionHeader } from "./SectionHeader";

const STATUS_LABELS: Record<Campanha["status"], string> = {
  RASCUNHO: "Rascunho", ENVIANDO: "Em envio", CONCLUIDA: "Concluída", PARCIAL: "Envio parcial",
};

export function NewsletterSection() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [configurado, setConfigurado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [selected, setSelected] = useState<Campanha | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCampanhas();
      setCampanhas(data.campanhas); setConfigurado(data.configurado);
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível carregar as campanhas."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function create(data: { assunto: string; conteudoHtml: string }) {
    setIsBusy(true); setError(null); setNotice(null);
    try {
      await createCampanha(data); setIsCreating(false);
      setNotice("Rascunho salvo. Revise a campanha antes de enviar."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível criar a campanha."); }
    finally { setIsBusy(false); }
  }

  async function send() {
    if (!selected) return;
    setIsBusy(true); setError(null); setNotice(null);
    try {
      const result = await sendCampanha(selected.id);
      setSelected(null); setNotice(result.mensagem); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível enviar a campanha."); }
    finally { setIsBusy(false); }
  }

  return <section>
    <SectionHeader title="Campanhas da Newsletter" buttonLabel="+ NOVA CAMPANHA" onButtonClick={() => { setError(null); setIsCreating(true); }} />
    <p className="mb-4 text-sm text-neutral-600">Crie um rascunho, revise o conteúdo e confirme o envio aos assinantes ativos.</p>
    {!loading && !configurado && <p role="status" className="mb-5 border border-amber-300 bg-amber-50 p-4 text-sm">O envio de e-mails ainda não foi configurado. Os rascunhos podem ser preparados; configure o SMTP no servidor para enviar.</p>}
    {error && !isCreating && !selected && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="mb-4 text-sm text-green-800">{notice}</p>}
    {loading ? <p role="status">Carregando campanhas...</p> : campanhas.length === 0 ? <p className="text-sm text-neutral-500">Nenhuma campanha cadastrada.</p> : <ul className="space-y-4">
      {campanhas.map((campanha) => <li key={campanha.id} className="flex flex-col gap-4 border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="break-words font-serif text-xl">{campanha.assunto}</h3>
          <p className="mt-1 text-xs text-neutral-500">{STATUS_LABELS[campanha.status]} · {new Date(campanha.createdAt).toLocaleDateString("pt-BR")}</p>
          {campanha.total > 0 && <p className="mt-2 text-sm text-neutral-600">{campanha.enviadas} enviadas · {campanha.pendentes} pendentes · {campanha.falhas} falhas · {campanha.incertas} a verificar · {campanha.canceladas} canceladas</p>}
        </div>
        <button type="button" onClick={() => { setError(null); setSelected(campanha); }} className="shrink-0 self-start border border-black px-4 py-2 text-xs font-semibold hover:bg-neutral-100">REVISAR CAMPANHA</button>
      </li>)}
    </ul>}
    <CreateModal isOpen={isCreating} onClose={() => { if (!isBusy) setIsCreating(false); }} title="Nova Campanha" size="large">
      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      <CampanhaForm onSubmit={create} onCancel={() => setIsCreating(false)} disabled={isBusy} />
    </CreateModal>
    <CreateModal isOpen={!!selected} onClose={() => { if (!isBusy) setSelected(null); }} title="Revisar Campanha" size="large">
      {selected && <>
        <h3 className="break-words font-serif text-2xl">{selected.assunto}</h3>
        <div className="editorial-content prose my-6 max-w-none break-words border border-neutral-200 bg-white p-4" dangerouslySetInnerHTML={{ __html: selected.conteudoHtml }} />
        <p className="text-sm text-neutral-600">Ao confirmar, esta campanha será enviada aos assinantes ativos. Entregas já confirmadas serão preservadas. Cancelamentos de inscrição são respeitados.</p>
        {selected.incertas > 0 && <p className="mt-3 text-sm text-amber-800">Há entregas com resultado incerto. Elas precisam de revisão no provedor de e-mail e não serão reenviadas automaticamente.</p>}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-4">
          <button type="button" disabled={isBusy} onClick={() => setSelected(null)} className="px-3 py-2 text-sm">FECHAR</button>
          <button type="button" disabled={isBusy || !configurado || selected.status === "ENVIANDO" || selected.status === "CONCLUIDA"} onClick={() => void send()} className="bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{isBusy ? "ENVIANDO..." : selected.status === "PARCIAL" ? "REPETIR ENTREGAS PENDENTES" : "CONFIRMAR ENVIO"}</button>
        </div>
      </>}
    </CreateModal>
  </section>;
}

function CampanhaForm({ onSubmit, onCancel, disabled }: { onSubmit: (data: { assunto: string; conteudoHtml: string }) => Promise<void>; onCancel: () => void; disabled: boolean }) {
  const [assunto, setAssunto] = useState("");
  const [conteudoHtml, setConteudoHtml] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); await onSubmit({ assunto, conteudoHtml }); }
  return <form onSubmit={submit} className="space-y-4">
    <div>
      <label htmlFor="campanha-assunto" className="mb-1 block text-xs font-semibold">ASSUNTO DO E-MAIL</label>
      <input id="campanha-assunto" required maxLength={200} value={assunto} onChange={(event) => setAssunto(event.target.value)} disabled={disabled} className="w-full border border-neutral-300 bg-white px-3 py-2" />
    </div>
    <div>
      <label htmlFor="campanha-content" className="mb-1 block text-xs font-semibold">CONTEÚDO</label>
      <RichTextEditor id="campanha-content" value={conteudoHtml} onChange={setConteudoHtml} disabled={disabled} />
    </div>
    <div className="flex flex-wrap justify-end gap-4">
      <button type="button" onClick={onCancel} disabled={disabled} className="px-3 py-2 text-sm">CANCELAR</button>
      <button type="submit" disabled={disabled} className="bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">{disabled ? "GUARDANDO..." : "GUARDAR RASCUNHO"}</button>
    </div>
  </form>;
}
