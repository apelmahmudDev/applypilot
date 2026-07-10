import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDialogProps = {
	open: boolean;
	title: string;
	description: React.ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	isConfirming?: boolean;
	confirmingLabel?: string;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
};

export function ConfirmDialog({
	open,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	isConfirming = false,
	confirmingLabel = "Working...",
	onOpenChange,
	onConfirm,
}: ConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="max-w-[380px] rounded-2xl border-border/80 px-5 py-4 shadow-[0_20px_45px_rgba(15,23,42,0.14)]"
				overlayClassName="bg-white/6 backdrop-blur-[0.8px]"
				showCloseButton={false}
			>
				<DialogHeader className="gap-2 text-left">
					<DialogTitle className="text-lg font-normal tracking-tight text-foreground">
						{title}
					</DialogTitle>
					<DialogDescription className="text-[15px] text-foreground">
						{description}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex-row justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						disabled={isConfirming}
						className="h-9 rounded-full border-border bg-background/90 px-4 text-sm font-semibold shadow-none"
						onClick={() => onOpenChange(false)}
					>
						{cancelLabel}
					</Button>
					<Button
						type="button"
						disabled={isConfirming}
						className="h-9 rounded-full bg-red-500 px-4 text-sm font-semibold text-white shadow-none hover:bg-red-600"
						onClick={onConfirm}
					>
						{isConfirming ? confirmingLabel : confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
