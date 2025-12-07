# Requirements & API routes
## Products
- GET /api/products [GET] — index
- GET /api/products/:id [GET] — show
- POST /api/products [POST] — create (requires JWT)
- GET /api/products/top [GET] — top 5 most popular products (optional)
- GET /api/products-by-category?category=foo [GET] — products by category
(optional)
## Users
- POST /api/users [POST] — create user (signup)
- POST /api/users/login [POST] — login (returns JWT)
- GET /api/users [GET] — index (requires JWT)
- GET /api/users/:id [GET] — show (requires JWT)
## Orders
- POST /api/orders [POST] — create order (requires JWT)
- POST /api/orders/:orderId/products [POST] — add product to order (requires
JWT)
- GET /api/orders/:id [GET] — show order (requires JWT)
- GET /api/orders/current?userId=1 [GET] — current order by user (requires JWT)
- PUT /api/orders/:orderId/complete [PUT] — mark complete (requires JWT)
## Data shapes
Product: { id, name, price, category }
User: { id, firstName, lastName, password }
Order:
 { id, user_id, status, items: [{ product_id, name, quantity, unit_price }] }
## Database schema
See migrations/001_create_tables.js for exact column types and table
relationships.