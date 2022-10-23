declare module '@mui/material/styles/createPalette' {
	export interface TypeBackground {
		default: string
		paper: string
		'gray-100': string
		'gray-200': string
		'gray-300': string
		'gray-400': string
		'gray-500': string
		'gray-600': string
		'gray-700': string
	}
}

export const dark = {
	primary: {
		main: '#8678D7',
		light: '#B0A2FC',
		dark: '#3B374D',
		contrastText: '#BCBCC2',
	},
	secondary: {
		main: '#595285',
		light: '#ff5395',
		dark: '#bb002f',
		contrastText: '#BCBCC2',
	},
	error: {
		main: '#f44336',
		light: '#e57373',
		dark: '#d32f2f',
		contrastText: '#BCBCC2',
	},
	text: {
		primary: '#81818A',
		secondary: '#BDBDBD',
		disabled: '#BCBCC2',
		hint: '#fff',
	},
	divider: '#44444B',
	action: {
		active: '#81818A',
		hover: '#BCBCC2',
		hoverOpacity: 0.08,
		selected: '#BCBCC2',
		selectedOpacity: 0.16,
		disabled: '#BCBCC2',
		disabledBackground: '#BCBCC2',
		disabledOpacity: 0.3,
		focus: '#BCBCC2',
		focusOpacity: 0.12,
		activatedOpacity: 0.24,
	},
	background: {
		paper: '#212126',
		default: '#212126',
		'gray-100': '#BCBCC2',
		'gray-200': '#81818A',
		'gray-300': '#57575F',
		'gray-400': '#44444B',
		'gray-500': '#36363C',
		'gray-600': '#2D2D33',
		'gray-700': '#212126',
	},
}

export const light = {
	primary: {
		main: '#1e88e5',
		light: '#6ab7ff',
		dark: '#005cb2',
		contrastText: '#fff',
	},
	secondary: {
		main: '#f50057',
		light: '#ff5395',
		dark: '#bb002f',
		contrastText: '#fff',
	},
	error: {
		main: '#f44336',
		light: '#e57373',
		dark: '#d32f2f',
		contrastText: '#fff',
	},
	text: {
		primary: '#000',
		secondary: '#000',
		disabled: '#000',
		hint: '#000',
	},
	divider: '#000',
	action: {
		active: '#000',
		hover: '#000',
		hoverOpacity: 0.08,
		selected: '#000',
		selectedOpacity: 0.16,
		disabled: '#000',
		disabledBackground: '#000',
	},
	background: {
		paper: '#6ab7ff',
		default: '#6ab7ff',
	},
}
