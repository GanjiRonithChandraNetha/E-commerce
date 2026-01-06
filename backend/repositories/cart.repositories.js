import {pool} from "../db/db.js";

export const getActiveCartQuery = async(profile_id)=>{
    const client =await pool.connect();
    let cart_id = null;
    try {
        await client.query("BEGIN");
        await client.query(`
            INSERT INTO carts(profile_id,status)
            VALUES ($1,'active')
            ON CONFLICT DO NOTHING`
            ,[profile_id]);
        const data = await client.query(`
            SELECT cart_id
            FROM carts
            WHERE profile_id = $1 AND status = 'active';`
            ,[profile_id]
        )
        await client.query("COMMIT");
        console.log(data)
        const rows = data.rows;
        console.log(rows.length)
        if (rows.length == 0) {
            throw new Error("Active cart not found");
        }
        return cart_id = rows[0];
    } catch (error) {
        console.log("error in getActiveCartQuery",error.message,error);
        await client.query("ROLLBACK");
    } finally{
        await client.release()
        console.log("client released");
    }
}

export const upsertItemQuery = async(cart_id,variantId,quantity)=>{
    console.log(cart_id,variantId,quantity);
    const data = await pool.query(`
        INSERT INTO cart_items (cart_id, variant_id, quantity)
        SELECT
            $1,
            v.variant_id,
            LEAST($2, v.stock)
        FROM product_variants v
        JOIN products p ON p.product_id = v.product_id
        WHERE v.variant_id = $3
        AND v.stock > 0
        AND p.status = 'active'

        ON CONFLICT (cart_id, variant_id)
        DO UPDATE
        SET quantity = LEAST(
            cart_items.quantity + EXCLUDED.quantity,
            (
                SELECT stock
                FROM product_variants
                WHERE variant_id = EXCLUDED.variant_id
            )
        );
        `
        ,[cart_id,quantity,variantId]
    );
    return data || null;
}

export const getCartDataQuery = async(cartId)=>{
    const query = `
    SELECT 
    ci.cart_item_id,
    ci.variant_id,
    ci.quantity,
    v.variant_name,
    v.price,
    img.url 
    FROM cart_items ci 
    LEFT JOIN product_variants v ON ci.variant_id = v.variant_id
    LEFT JOIN LATERAL(
        SELECT url,variant_id FROM images WHERE variant_id = v.variant_id LIMIT 1
    )img ON true
    WHERE ci.cart_id = $1;
    `
    const {rows} = await pool.query(query,[cartId]);
    return rows;
}