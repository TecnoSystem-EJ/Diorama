"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function PdfReader({ url, title, label = "Ler PDF" }: { url: string; title: string; label?: string }) {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);

  return <>
    <div className="flex flex-wrap items-center gap-4"><button type="button" disabled={!ready} className="border border-black bg-black px-6 py-3 text-sm text-white hover:bg-neutral-800 disabled:opacity-50" onClick={() => setOpen(true)}>{label}</button><a className="underline" href={url} target="_blank" rel="noopener noreferrer">Abrir PDF ↗</a></div>
    {open && <dialog ref={dialog} className="pdf-dialog" aria-labelledby={titleId} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="flex h-full min-h-0 flex-col"><div className="flex items-center justify-between gap-4 border-b border-black/15 p-4"><h2 id={titleId} className="font-serif text-xl min-w-0 truncate">{title}</h2><button type="button" className="border border-black px-6 py-3 text-sm hover:bg-neutral-100 disabled:opacity-50 shrink-0" autoFocus onClick={() => setOpen(false)}>Fechar PDF</button></div>
        <p className="px-4 py-3 text-sm">Se o documento não aparecer no seu dispositivo, <a className="underline" href={url} target="_blank" rel="noopener noreferrer">abra o PDF em outra aba</a> ou <a className="underline" href={url} target="_blank" rel="noopener noreferrer" download>baixe o arquivo</a>.</p>
        <iframe src={url} title={`PDF — ${title}`} referrerPolicy="no-referrer" className="w-full flex-1 min-h-0 bg-neutral-200" />
      </div>
    </dialog>}
  </>;
}
