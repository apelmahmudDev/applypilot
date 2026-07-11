import React from "react";
import ReactDOM from "react-dom/client";

import "@/assets/tailwind.css";
import App from "./App.tsx";

document.documentElement.dataset.surface = "dashboard";
document.body.dataset.surface = "dashboard";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
