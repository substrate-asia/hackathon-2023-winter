
import { ThemeProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UtilsProvider } from "../contexts/UtilsContext";
import { PolkadotProvider } from "../contexts/PolkadotContext";
import "../public/css/daos.css";
import "../public/css/ideas.css";
import "../public/output.css";
import "../public/theme.css";

import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../components/layout/Header'), { ssr: false })

function MyApp({ Component, pageProps }) {
	return (
		<UtilsProvider>
			<PolkadotProvider>
				<ThemeProvider defaultTheme={"dark"} enableColorScheme={false} attribute="class" enableSystem={false}>
					<Header />
					<Component {...pageProps} />
					<ToastContainer
						hideProgressBar={false}
						position="top-right"
						autoClose={3000}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						draggable
						pauseOnHover
						theme="light"
						
					/>
				</ThemeProvider>
			</PolkadotProvider>

		</UtilsProvider>
	);
}

export default MyApp;
