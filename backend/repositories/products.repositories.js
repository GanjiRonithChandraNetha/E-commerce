import {pool} from "../db/db.js";


export const getProductsByPriceRepo = async (
    searchString,
    lastProductId,
    lastPrice,
    orderBy = "ASC",
    limit = 20
) => {

    console.log("inside price")
    const values = [];
    let idx = 1;

    let query = `
        SELECT
        p.product_id,
        p.product_name,
        v.variant_id,
        v.variant_name,
        v.price,
        COALESCE(ARRAY_AGG(i.url) FILTER (WHERE i.url IS NOT NULL), '{}') AS images
        FROM products p
        LEFT JOIN LATERAL (
        SELECT variant_id, variant_name, price,stock,status
        FROM product_variants
        WHERE product_id = p.product_id
        ORDER BY price ASC
        LIMIT 1
        ) v ON true
        LEFT JOIN images i
        ON v.variant_id = i.variant_id
    `;

    const where = [];

    if (lastProductId && lastPrice) {
        where.push(`(v.price, p.product_id) ${orderBy === "ASC" ? ">" : "<"} ($${idx++}, $${idx++})`);
        values.push(lastPrice, lastProductId);
    }

    if (searchString) {
        where.push(`p.product_name ILIKE '%' || $${idx++} || '%'`);
        values.push(searchString);
    }

    where.push("p.status = \'active\'");
    where.push("v.stock > 0");

    if (where.length) {
        query += ` WHERE ` + where.join(" AND ");
    }

    query += `
        GROUP BY
        p.product_id,
        p.product_name,
        v.variant_id,
        v.variant_name,
        v.price
        ORDER BY
        v.price ${orderBy},
        p.product_id ${orderBy}
        LIMIT $${idx}
    `;

    values.push(limit);

    // console.log(query);

    const {rows} = await pool.query(query, values);
    return rows;
};


export const getProductsByTimeRepo = async (
  searchString,
  lastProductId,
  lastCreatedId,
  orderBy = "ASC",
  limit = 20
) => {
    console.log("inside time");
    const values = [];
    let idx = 1;

    let query = `
        SELECT
            p.product_id,
            p.product_name,
            v.variant_id,
            v.variant_name,
            v.price,
            COALESCE(ARRAY_AGG(i.url) FILTER (WHERE i.url IS NOT NULL), '{}') AS images
        FROM products p
        LEFT JOIN LATERAL (
            SELECT variant_id, variant_name, price, created_at,stock,status
            FROM product_variants
            WHERE product_id = p.product_id
            ORDER BY price ASC
            LIMIT 1
        ) v ON true
        LEFT JOIN images i
            ON v.variant_id = i.variant_id
    `;

    const where = [];

    if (lastCreatedId && lastProductId) {
    where.push(`(v.created_at, p.product_id) ${orderBy === "ASC" ? ">" : "<"} ($${idx++}, $${idx++})`);
    values.push(lastCreatedId, lastProductId);
    }

    if (searchString) {
    where.push(`p.product_name ILIKE '%' || $${idx++} || '%'`);
    values.push(searchString);
    }

    where.push("p.status = \'active\'");
    where.push("v.stock > 0");

    if (where.length) {
    query += ` WHERE ` + where.join(" AND ");
    }

    query += `
    GROUP BY
        p.product_id,
        p.product_name,
        v.variant_id,
        v.variant_name,
        v.price,
        v.created_at
    ORDER BY
        v.created_at ${orderBy},
        p.product_id ${orderBy}
    LIMIT $${idx}
    `;

    values.push(limit);

    // console.log(query);

    const {rows} = await pool.query(query, values);
    return rows;
};


export const getVariantsRepo = async(productId,variantId)=>{
    const query = `
    SELECT v.variant_id,
    v.product_id,
    v.variant_name,
    v.stock,
    v.price,
    v.flag,
    COALESCE(ARRAY_AGG(i.url) FILTER (WHERE i.url IS NOT NULL),'{}') AS images
    FROM product_variants v 
    LEFT JOIN images i ON v.variant_id = i.variant_id
    WHERE v.variant_id != $1 and v.product_id = $2
    GROUP BY 
    v.variant_id,
    v.product_id,
    v.variant_name,
    v.stock,
    v.price,
    v.flag;`

    const {rows} = await pool.query(query,[variantId,productId]);
    return rows || null;
}

export const getVariantRepo = async (variantId)=>{
    const query = `
    SELECT v.variant_id,
    v.product_id,
    v.variant_name,
    v.stock,
    v.price,
    v.flag,
    p.product_name,
    p.product_description,
    COALESCE(ARRAY_AGG(i.url) FILTER (WHERE i.url IS NOT NULL),'{}') AS images
    FROM product_variants v LEFT JOIN products p ON v.product_id = p.product_id
    LEFT JOIN images i on v.variant_id = i.variant_id
    WHERE v.variant_id = $1
    GROUP BY v.variant_id,
    v.product_id,
    v.variant_name,
    v.stock,
    v.price,
    v.flag,
    p.product_name,
    p.product_description;`;
    const {rows} = await pool.query(query,[variantId]);
    return rows || null;
}