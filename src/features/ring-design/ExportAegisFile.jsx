export const exportAegisCsv = (rings) => {
  const headers = ['LDR', 'HoleCount', 'DesignMetres', 'X', 'Y', 'Z', 'Burden', 'Azi', 'Dump'];

  const rows = rings.map((r) => [
    `${r.level}_${r.oredrive}_${r.ring_number_txt}`,
    r.holes ?? '',
    parseFloat(r.drill_meters ?? 0).toFixed(1),
    parseFloat(r.x ?? 0).toFixed(2),
    parseFloat(r.y ?? 0).toFixed(2),
    parseFloat(r.z ?? 0).toFixed(2),
    r.burden ?? '',
    r.azimuth ?? '',
    r.dump ?? ''
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'AegisDesignSync.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
