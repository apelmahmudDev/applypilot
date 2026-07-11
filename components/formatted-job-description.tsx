import DOMPurify from "dompurify";
import { useMemo } from "react";

interface FormattedJobDescriptionProps {
	descriptionHtml?: string;
	descriptionText?: string;
}

const ALLOWED_TAGS = [
	"p",
	"div",
	"span",
	"br",
	"ul",
	"ol",
	"li",
	"strong",
	"b",
	"em",
	"i",
	"u",
	"a",
	"h1",
	"h2",
	"h3",
	"h4",
	"blockquote",
	"pre",
	"code",
];

export function FormattedJobDescription({
	descriptionHtml,
	descriptionText,
}: FormattedJobDescriptionProps) {
	const safeHtml = useMemo(() => {
		if (!descriptionHtml) {
			return "";
		}

		return DOMPurify.sanitize(descriptionHtml, {
			ALLOWED_TAGS,
			ALLOWED_ATTR: ["href", "title"],
			ALLOW_DATA_ATTR: false,
		});
	}, [descriptionHtml]);

	const baseClassName =
		"applypilot-job-description text-[13px] leading-[1.65] text-muted-foreground break-words " +
		"[&_p]:mb-3 [&_p:last-child]:mb-0 [&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-foreground " +
		"[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground " +
		"[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-foreground " +
		"[&_h4]:mb-2 [&_h4]:mt-4 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-foreground " +
		"[&_h1:first-child]:mt-0 [&_h2:first-child]:mt-0 [&_h3:first-child]:mt-0 [&_h4:first-child]:mt-0 " +
		"[&_ul]:mb-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 " +
		"[&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_b]:font-semibold [&_b]:text-foreground " +
		"[&_a]:text-primary [&_a:hover]:underline [&_blockquote]:my-3 [&_blockquote]:border-l-[3px] [&_blockquote]:border-border [&_blockquote]:pl-3 " +
		"[&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_code]:font-mono [&_code]:text-[12px]";

	if (safeHtml) {
		return (
			<div
				className={baseClassName}
				dangerouslySetInnerHTML={{ __html: safeHtml }}
			/>
		);
	}

	return (
		<div className={`${baseClassName} whitespace-pre-wrap`}>
			{descriptionText || "No description available."}
		</div>
	);
}
