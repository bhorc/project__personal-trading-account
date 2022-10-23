import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';

import App from './App';
import './index.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<App />
			<ToastContainer
				theme="dark"
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</StyledEngineProvider>
	</React.StrictMode>
);
