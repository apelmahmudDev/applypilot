import DOMPurify from "dompurify";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Redo2, Undo2 } from "lucide-react";
import { type ReactNode, useEffect, useMemo } from "react";

import { cn } from "@/lib/utils";

type JobDescriptionEditorProps = {
	value: string;
	onChange: (value: { html: string; text: string }) => void;
};

const ALLOWED_TAGS = [
	"p", "br", "ul", "ol", "li", "strong", "b", "em", "i", "s", "code", "pre", "blockquote", "h1", "h2", "h3",
];

export function JobDescriptionEditor({ value, onChange }: JobDescriptionEditorProps) {
	const initialContent = useMemo(() => toEditorHtml(value), [value]);
	const editor = useEditor({
		extensions: [StarterKit],
		content: initialContent,
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: "min-h-48 px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none dark:text-foreground",
			},
		},
		onUpdate: ({ editor: updatedEditor }) => {
			onChange({
				html: updatedEditor.getHTML(),
				text: updatedEditor.getText({ blockSeparator: "\n" }),
			});
		},
	});

	useEffect(() => {
		if (!editor || editor.isFocused || editor.getHTML() === initialContent) return;
		editor.commands.setContent(initialContent, { emitUpdate: false });
	}, [editor, initialContent]);

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-[#454040] dark:bg-card">
			<div className="flex flex-wrap gap-1 border-b border-slate-100 p-1.5 dark:border-border/60">
				<EditorToolbarButton label="Bold" isActive={editor?.isActive("bold")} disabled={!editor} onClick={() => editor?.chain().focus().toggleBold().run()}>
					<Bold className="size-3.5" aria-hidden="true" />
				</EditorToolbarButton>
				<EditorToolbarButton label="Italic" isActive={editor?.isActive("italic")} disabled={!editor} onClick={() => editor?.chain().focus().toggleItalic().run()}>
					<Italic className="size-3.5" aria-hidden="true" />
				</EditorToolbarButton>
				<EditorToolbarButton label="Bulleted list" isActive={editor?.isActive("bulletList")} disabled={!editor} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
					<List className="size-3.5" aria-hidden="true" />
				</EditorToolbarButton>
				<EditorToolbarButton label="Numbered list" isActive={editor?.isActive("orderedList")} disabled={!editor} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
					<ListOrdered className="size-3.5" aria-hidden="true" />
				</EditorToolbarButton>
				<span className="mx-0.5 w-px bg-slate-200 dark:bg-border" aria-hidden="true" />
				<EditorToolbarButton label="Undo" disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()}>
					<Undo2 className="size-3.5" aria-hidden="true" />
				</EditorToolbarButton>
				<EditorToolbarButton label="Redo" disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()}>
					<Redo2 className="size-3.5" aria-hidden="true" />
				</EditorToolbarButton>
			</div>
			<EditorContent editor={editor} />
		</div>
	);
}

type EditorToolbarButtonProps = {
	label: string;
	isActive?: boolean;
	disabled: boolean;
	onClick: () => void;
	children: ReactNode;
};

function EditorToolbarButton({ label, isActive = false, disabled, onClick, children }: EditorToolbarButtonProps) {
	return (
		<button
			type="button"
			className={cn(
				"flex size-7 items-center justify-center rounded text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground",
				isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
			)}
			aria-label={label}
			title={label}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

function toEditorHtml(value: string): string {
	if (!value.trim()) return "<p></p>";
	if (/<[a-z][\s\S]*>/i.test(value)) {
		return DOMPurify.sanitize(value, {
			ALLOWED_TAGS,
			ALLOWED_ATTR: [],
			ALLOW_DATA_ATTR: false,
		});
	}

	return value
		.split(/\r?\n{2,}/)
		.map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\r?\n/g, "<br>")}</p>`)
		.join("");
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
