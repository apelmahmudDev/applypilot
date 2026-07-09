import { useState } from "react";

import { saveJobToStorage, type SaveJobResult } from "@/lib/jobs/storage";
import { DetectedJobView } from "@/modules/popup/components/detected-job-view";
import { EditJobView } from "@/modules/popup/components/edit-job-view";
import { PopupShell } from "@/modules/popup/components/popup-shell";
import { SavedJobView } from "@/modules/popup/components/saved-job-view";
import { useDetectedJob } from "@/modules/popup/hooks/use-detected-job";
import type { JobForm, PopupView } from "@/modules/popup/types";

function App() {
	const [view, setView] = useState<PopupView>("detected");
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState("");
	const [saveResult, setSaveResult] = useState<SaveJobResult | null>(null);
	const { job, setJob, isDetecting, error, confidence } = useDetectedJob();

	const saveJob = async (savedJob: JobForm = job) => {
		setIsSaving(true);
		setSaveError("");

		try {
			const result = await saveJobToStorage(savedJob);
			setSaveResult(result);
			setJob(result.job);
			setView("saved");
		} catch {
			setSaveError("Could not save this job. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<PopupShell>
			{view === "detected" && (
				<DetectedJobView
					job={job}
					confidence={confidence}
					error={error}
					isDetecting={isDetecting}
					isSaving={isSaving}
					saveError={saveError}
					onEdit={() => setView("edit")}
					onSave={saveJob}
				/>
			)}
			{view === "edit" && (
				<EditJobView
					job={job}
					onCancel={() => setView("detected")}
					onSave={saveJob}
				/>
			)}
			{view === "saved" && <SavedJobView job={job} saveAction={saveResult?.action} />}
		</PopupShell>
	);
}

export default App;
