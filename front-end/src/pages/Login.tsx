import React from 'react';
import axios from 'axios';
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, TextField, Typography, useTheme } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const formWidth = 450;
type State = {
	login: string;
	password: string;
	showPassword?: boolean;
}
type ServerAnswer = {
	message: string;
	data?: object;
}

const Login = () => {
	const navigate = useNavigate();
	const { palette } = useTheme();
	const fetchLogin = (data: FormData) => {
		axios
			.post<ServerAnswer>('http://localhost:3001/api/user/login', data, { withCredentials: true })
			.then((res) => {
				localStorage.setItem('authenticated', String(true));
				navigate('/');
				toast.success(res.data.message);
			})
			.catch((err) => {
				toast.error(err.response.data.message);
			});
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.target as HTMLFormElement);
		fetchLogin(data);
	};

	const [values, setValues] = React.useState<State>({
		login: '',
		password: '',
		showPassword: false,
	});

	const handleChange =
		(prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setValues({ ...values, [prop]: event.target.value });
		};

	const handleClickShowPassword = () => {
		setValues({
			...values,
			showPassword: !values.showPassword,
		});
	};

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justifyContent="center"
			style={{ minHeight: '100vh' }}
		>
			<Grid item sx={{
				bgcolor: 'background.gray-400',
				padding: '40px 60px',
				borderRadius: '12px',
				borderTop: '15px solid ' + palette.background['gray-500'],
				borderBottom: '30px solid ' + palette.secondary.main,
				width: formWidth,
			}}>
				<Box component="form" onSubmit={handleSubmit} noValidate>
					<TextField
						sx={{
							'& fieldset': {
								borderColor: 'text.secondary',
								borderWidth: 2,
							},
							'& input:-webkit-autofill': {
								WebkitBoxShadow: `0 0 0 100px ${palette.background['gray-300']} inset`
							},
							mb: '20px',
						}}
						margin="normal"
						required
						fullWidth
						value={values.login}
						onChange={handleChange('login')}
						id="email"
						label="Email Address"
						name="login"
						autoComplete="email"
						size="small"
					/>
					<FormControl variant="outlined" fullWidth sx={{ mb: '20px' }}>
						<InputLabel htmlFor="outlined-adornment-password" size="small">Password *</InputLabel>
						<OutlinedInput
							sx={{
								'& fieldset': {
									borderColor: 'text.secondary',
									borderWidth: 2,
								},
								'& input:-webkit-autofill': {
									WebkitBoxShadow: `0 0 0 100px ${palette.background['gray-300']} inset`
								},
							}}
							size="small"
							id="outlined-adornment-password"
							type={values.showPassword ? 'text' : 'password'}
							value={values.password}
							required
							name="password"
							onChange={handleChange('password')}
							autoComplete="password"
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge="end"
										size="small"
									>
										{values.showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
									</IconButton>
								</InputAdornment>
							}
							label="Password"
						/>
					</FormControl>

					<Grid container alignItems="center" justifyContent="space-between" sx={{ mb: '20px' }}>
						<Grid item>
							<FormControlLabel
								control={<Checkbox value="remember" color="primary" />}
								label={<Typography color="text.secondary">Remember me</Typography>}
							/>
						</Grid>
						<Grid item>
							<Link href="#" variant="body2">
								Forgot password?
							</Link>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mb: '30px' }}
					>
						Sign In
					</Button>
					<Grid container alignItems="center" justifyContent="space-between">
						<Grid item>
							<Typography variant="subtitle2" color="text.secondary">
								{'Don\'t have an account?'}
							</Typography>
						</Grid>
						<Grid item>
							<Link href="#" variant="body2">
								Contact us
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Grid>
		</Grid>
	);
};

export default Login;
