export function openSociosReport(data = []) {
  if (!data.length) return;

  const total = data.reduce((a, s) => a + (s.importe || 0), 0);

  const win = window.open("", "_blank");
  if (!win) return;

  const rows = data.map(s => `
    <tr>
      <td>${s.id_socio}</td>
      <td>${s.plan}</td>
      <td>${s.importe}</td>
    </tr>
  `).join("");

  win.document.write(`
    <html>
      <head>
        <title>Reporte MIS</title>

        <style>
          body {
            font-family: Arial;
            padding: 30px;
            text-align: center;
          }

          table {
            margin: auto;
            border-collapse: collapse;
            width: 80%;
          }

          th, td {
            border: 1px solid #333;
            padding: 10px;
          }

          th {
            background: #eee;
          }

          .total {
            margin-top: 20px;
            font-weight: bold;
          }
        </style>
      </head>

      <body>
        <h2>Reporte total de ventas - PowerGymSJ</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Plan</th>
              <th>Importe</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="total">
          TOTAL: $${total}
        </div>

        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);

  win.document.close();
}