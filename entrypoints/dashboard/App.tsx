import { Toaster } from "@/components/ui/sonner";
import { DashboardView } from "@/modules/dashboard/view/dashboard-view";

function App() {
	return (
		<>
			<DashboardView />
			<Toaster position="top-center" richColors />
		</>
	);
}

export default App;
