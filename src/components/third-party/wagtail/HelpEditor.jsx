// components/HelpEditor.jsx
import React, { useState, useEffect } from 'react';
import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from 'draftail';
import { fetcher } from 'utils/axiosCms';

export default function HelpEditor({ identifier, onDone }) {
  const [initial, setInitial] = useState(null);
  const [editorState, setEditorState] = useState(null);
  const [saving, setSaving] = useState(false);

  // 1) load the raw JSON on mount
  useEffect(() => {
    fetcher(`helpdocs/help/${id}/`)
      .then(({ data }) => {
        setInitial(data.body);
        setEditorState(DraftailEditor.createEditorState(data.body));
      })
      .catch(console.error);
  }, [identifier]);

  if (!editorState) return <div>Loading editor…</div>;

  // 2) toolbar config
  const toolbar = [
    { type: BLOCK_TYPE.HEADER_ONE },
    { type: INLINE_STYLE.BOLD },
    { type: INLINE_STYLE.ITALIC },
    { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
    { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
    { type: BLOCK_TYPE.LINK }
  ];

  // 3) save changes back to Wagtail
  const save = async () => {
    setSaving(true);
    const raw = editorState.toRAW(); // Draftail → JSON
    try {
      await fetcher.patch(`helpdocs/help/${id}/`, { body: raw });
      onDone(); // e.g. close dialog or show “Saved!”
    } catch (err) {
      console.error(err);
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <DraftailEditor rawContentState={initial} onChange={setEditorState} toolbarConfig={toolbar} />
      <button onClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}
