import { BD, TX, AC } from '../constants';

export default function CompTable({ headers, rows }) {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, width: '100%' }}>
      <thead>
        <tr>{headers.map((h, i) => (
          <th key={i} style={{ border: `1.5px solid ${BD}`, padding: '5px 10px', background: TX, color: '#fff', textAlign: 'left', fontSize: 10.5, letterSpacing: 0.5 }}>{h}</th>
        ))}</tr>
      </thead>
      <tbody>{rows.map((row, i) => (
        <tr key={i} style={{ background: i % 2 === 0 ? '#f0f0ec' : '#fff' }}>
          {row.map((cell, j) => (
            <td key={j} style={{ border: '1px solid #ccc', padding: '5px 10px', color: j === 0 ? TX : AC, fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  );
}
