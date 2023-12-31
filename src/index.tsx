import ReactDOM from 'react-dom/client'
import './index.css'
import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import App from './App'
import reportWebVitals from './reportWebVitals'
import 'dayjs/locale/sv'
import '@fontsource/roboto/300.css' // eslint-disable-line import/no-extraneous-dependencies
import '@fontsource/roboto/400.css' // eslint-disable-line import/no-extraneous-dependencies
import '@fontsource/roboto/500.css' // eslint-disable-line import/no-extraneous-dependencies
import '@fontsource/roboto/700.css' // eslint-disable-line import/no-extraneous-dependencies

dayjs.extend(relativeTime)
dayjs.locale('sv')

const root = ReactDOM.createRoot(
    // eslint-disable-next-line no-undef
    document.getElementById('root') as HTMLElement
)
/*
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
*/
root.render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
