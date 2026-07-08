import { useState } from "react";

import { DetectedJobView } from "@/modules/popup/components/detected-job-view";
import { EditJobView } from "@/modules/popup/components/edit-job-view";
import { PopupShell } from "@/modules/popup/components/popup-shell";
import { SavedJobView } from "@/modules/popup/components/saved-job-view";
import { detectedJob } from "@/modules/popup/mock-job";
import type { JobForm, PopupView } from "@/modules/popup/types";

function App() {
	const [view, setView] = useState<PopupView>("detected");
	const [job, setJob] = useState<JobForm>(detectedJob);

	const saveJob = (savedJob: JobForm = job) => {
		setJob(savedJob);
		setView("saved");
	};

	return (
		<PopupShell>
			{view === "detected" && (
				<DetectedJobView
					job={job}
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
			{view === "saved" && <SavedJobView job={job} />}
		</PopupShell>
	);
}

export default App;
