import { useState } from 'react';
import Notice from '../components/Notice';
import { useAuth } from '../context/AuthContext';
import { EMAIL_REGEX, PHONE_REGEX } from '../lib/constants';
import { Link, Redirect, navigate, useRoute } from '../lib/router';

const EMPTY = { name: '', phone: '', email: '', password: '' };

function validate(form, isRegister) {
  const errors = {};
  if (!EMAIL_REGEX.test(form.email)) errors.email = 'Enter a valid email address.';
  if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (isRegister) {
    if (form.name.trim().length < 2) errors.name = 'Enter your full name.';
    if (!PHONE_REGEX.test(form.phone)) {
      errors.phone = 'Enter a 10-digit Indian mobile number starting with 6-9.';
    }
  }
  return errors;
}

export default function Auth({ mode }) {
  const isRegister = mode === 'register';
  const { user, login, register } = useAuth();
  const { query } = useRoute();

  // Only allow redirects to in-app paths such as /book/123 (never //evil.com).
  const from = query.get('from');
  const redirectTo = from && from.startsWith('/') && !from.startsWith('//') ? from : '/services';
  const fromQuery = from ? `?from=${encodeURIComponent(from)}` : '';

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Redirect to={redirectTo} />;

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    const found = validate(form, isRegister);
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      if (isRegister) {
        await register({
          name: form.name.trim(),
          phone: form.phone,
          email: form.email.trim(),
          password: form.password,
        });
      } else {
        await login(form.email.trim(), form.password);
      }
      navigate(redirectTo);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const field = (name, label, type = 'text', extra = {}) => (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} value={form[name]} onChange={update} {...extra} />
      {errors[name] && <small className="error-text">{errors[name]}</small>}
    </label>
  );

  return (
    <form className="panel narrow" onSubmit={submit} noValidate>
      <h1>{isRegister ? 'Create account' : 'Welcome back'}</h1>
      {serverError && <Notice type="error">{serverError}</Notice>}

      {isRegister && field('name', 'Full name', 'text', { autoComplete: 'name' })}
      {isRegister &&
        field('phone', 'Mobile number', 'tel', { maxLength: 10, autoComplete: 'tel-national' })}
      {field('email', 'Email', 'email', { autoComplete: 'email' })}
      {field('password', 'Password', 'password', {
        autoComplete: isRegister ? 'new-password' : 'current-password',
      })}

      <button className="btn btn-block" disabled={busy}>
        {busy ? 'Please wait…' : isRegister ? 'Register' : 'Log in'}
      </button>
      <p className="muted small center">
        {isRegister ? 'Already registered?' : 'New here?'}{' '}
        <Link to={`${isRegister ? '/login' : '/register'}${fromQuery}`}>
          {isRegister ? 'Log in' : 'Create an account'}
        </Link>
      </p>
    </form>
  );
}
