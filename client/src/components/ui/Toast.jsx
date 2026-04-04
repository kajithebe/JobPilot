export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: '#ef4444',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
}
