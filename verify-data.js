// Native fetch

/*
 * Verification Script:
 * 1. Checks Product Count
 * 2. Checks Blog Count
 * 3. Measures API Latency for Products
 */

async function verify() {
    const start = Date.now();
    try {
        // 1. Fetch Products
        const res = await fetch('http://localhost:3000/api/products?limit=1');
        const data = await res.json();
        const duration = Date.now() - start;

        console.log(`API Latency: ${duration}ms`);

        if (data.success) {
            console.log(`Total Products in DB: ${data.pagination.totalCount}`);
            if (data.pagination.totalCount > 0) {
                console.log("✅ Products exist.");
            } else {
                console.error("❌ No products found.");
            }
        } else {
            console.error("❌ API Error:", data.error);
        }

        // 2. Fetch Blogs
        const blogRes = await fetch('http://localhost:3000/api/blogs?limit=1');
        const blogData = await blogRes.json();
        if (blogData.success) {
            console.log(`Total Blogs in DB: ${blogData.pagination.totalCount}`);
        }

    } catch (e) {
        console.error("Verification failed:", e.message);
    }
}

verify();
