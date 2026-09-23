import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { 
            project_name, customer_name, length, width, height, 
            floor_material, wall_material, ceiling_material, 
            volume, rt_current, rt_optimized 
        } = req.body;

        const result = await sql`
            insert into public.acoustics_projects 
            (project_name, customer_name, length, width, height, floor_material, wall_material, ceiling_material, volume, rt_current, rt_optimized)
            values 
            (${project_name}, ${customer_name}, ${length}, ${width}, ${height}, ${floor_material}, ${wall_material}, ${ceiling_material}, ${volume}, ${sql.json(rt_current)}, ${sql.json(rt_optimized)})
            returning id;
        `;

        return res.status(200).json({ success: true, id: result[0].id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database error' });
    }
}
