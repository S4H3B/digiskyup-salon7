export default function Notice({ type = 'info', title, children }) {
  return (
    <div className={`notice notice-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </div>
  );
}
