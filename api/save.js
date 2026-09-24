import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      project_name,
      customer_name,
      length,
      width,
      height,
      volume,
      walls,
      ceiling,
      selected_product,
      coverage_percentage,
      coverage_sqm,
      rt_current,
      rt_treated
    } = req.body;

    const query = `
      INSERT INTO public.acoustic_projects
      (project_name, customer_name, length, width, height, volume, walls, ceiling, selected_product, coverage_percentage, coverage_sqm, rt_current, rt_treated)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id;
    `;

    const values = [
      project_name || 'Progetto',
      customer_name || 'Cliente',
      length || 0,
      width || 0,
      height || 0,
      volume || 0,
      walls || {},
      ceiling || {},
      selected_product || '',
      coverage_percentage || 0,
      coverage_sqm || 0,
      JSON.stringify(rt_current || []),
      JSON.stringify(rt_treated || [])
    ];

    const result = await pool.query(query, values);

    return res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}
