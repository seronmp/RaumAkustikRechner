import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

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

    const result = await sql`
      insert into public.acoustic_projects
      (project_name, customer_name, length, width, height, volume, walls, ceiling, selected_product, coverage_percentage, coverage_sqm, rt_current, rt_treated)
      values
      (
        ${project_name || 'Progetto'}, 
        ${customer_name || 'Cliente'}, 
        ${length || 0}, 
        ${width || 0}, 
        ${height || 0}, 
        ${volume || 0}, 
        ${sql.json(walls || {})}, 
        ${sql.json(ceiling || {})}, 
        ${selected_product || ''}, 
        ${coverage_percentage || 0}, 
        ${coverage_sqm || 0}, 
        ${sql.json(rt_current || [])}, 
        ${sql.json(rt_treated || [])}
      )
      returning id;
    `;

    return res.status(200).json({ success: true, id: result[0].id });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: error.message });
  }
}
