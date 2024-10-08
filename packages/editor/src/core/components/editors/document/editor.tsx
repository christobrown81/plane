import React from "react";
// components
import { PageRenderer } from "@/components/editors";
// constants
import { DEFAULT_DISPLAY_CONFIG } from "@/constants/config";
// helpers
import { getEditorClassNames } from "@/helpers/common";
// hooks
import { useDocumentEditor } from "@/hooks/use-document-editor";
// plane editor types
import { TEmbedConfig } from "@/plane-editor/types";
// types
import {
  EditorRefApi,
  IMentionHighlight,
  IMentionSuggestion,
  TAIHandler,
  TDisplayConfig,
  TExtensions,
  TFileHandler,
} from "@/types";

interface IDocumentEditor {
  aiHandler?: TAIHandler;
  containerClassName?: string;
  disabledExtensions?: TExtensions[];
  displayConfig?: TDisplayConfig;
  editorClassName?: string;
  embedHandler: TEmbedConfig;
  fileHandler: TFileHandler;
  forwardedRef?: React.MutableRefObject<EditorRefApi | null>;
  handleEditorReady?: (value: boolean) => void;
  id: string;
  mentionHandler: {
    highlights: () => Promise<IMentionHighlight[]>;
    suggestions: () => Promise<IMentionSuggestion[]>;
  };
  onChange: (updates: Uint8Array) => void;
  placeholder?: string | ((isFocused: boolean, value: string) => string);
  tabIndex?: number;
  value: Uint8Array;
}

const DocumentEditor = (props: IDocumentEditor) => {
  const {
    aiHandler,
    containerClassName,
    disabledExtensions,
    displayConfig = DEFAULT_DISPLAY_CONFIG,
    editorClassName = "",
    embedHandler,
    fileHandler,
    forwardedRef,
    handleEditorReady,
    id,
    mentionHandler,
    onChange,
    placeholder,
    tabIndex,
    value,
  } = props;

  // use document editor
  const { editor, isIndexedDbSynced } = useDocumentEditor({
    disabledExtensions,
    id,
    editorClassName,
    embedHandler,
    fileHandler,
    value,
    onChange,
    handleEditorReady,
    forwardedRef,
    mentionHandler,
    placeholder,
    tabIndex,
  });

  const editorContainerClassNames = getEditorClassNames({
    noBorder: true,
    borderOnFocus: false,
    containerClassName,
  });

  if (!editor || !isIndexedDbSynced) return null;

  return (
    <PageRenderer
      displayConfig={displayConfig}
      aiHandler={aiHandler}
      editor={editor}
      editorContainerClassName={editorContainerClassNames}
      id={id}
      tabIndex={tabIndex}
    />
  );
};

const DocumentEditorWithRef = React.forwardRef<EditorRefApi, IDocumentEditor>((props, ref) => (
  <DocumentEditor {...props} forwardedRef={ref as React.MutableRefObject<EditorRefApi | null>} />
));

DocumentEditorWithRef.displayName = "DocumentEditorWithRef";

export { DocumentEditorWithRef };
