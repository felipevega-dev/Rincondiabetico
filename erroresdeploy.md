[15:22:32.172] Running build in Washington, D.C., USA (East) – iad1
[15:22:32.173] Build machine configuration: 2 cores, 8 GB
[15:22:32.208] Cloning github.com/felipevega-dev/Rincondiabetico (Branch: main, Commit: f82b084)
[15:22:32.222] Skipping build cache, deployment was triggered without cache.
[15:22:33.190] Cloning completed: 982.000ms
[15:22:35.693] Running "vercel build"
[15:22:36.174] Vercel CLI 44.6.4
[15:22:36.529] Installing dependencies...
[15:22:56.751] 
[15:22:56.752] added 502 packages in 20s
[15:22:56.753] 
[15:22:56.753] 162 packages are looking for funding
[15:22:56.754]   run `npm fund` for details
[15:22:56.795] Detected Next.js version: 15.3.4
[15:22:56.802] Running "npm run build"
[15:22:56.917] 
[15:22:56.918] > rincondiabetico@0.1.0 build
[15:22:56.918] > next build
[15:22:56.918] 
[15:22:57.531] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[15:22:57.533] This information is used to shape Next.js' roadmap and prioritize features.
[15:22:57.533] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[15:22:57.534] https://nextjs.org/telemetry
[15:22:57.534] 
[15:22:57.634]    ▲ Next.js 15.3.4
[15:22:57.635] 
[15:22:57.670]    Creating an optimized production build ...
[15:23:15.345]  ⚠ Compiled with warnings in 16.0s
[15:23:15.345] 
[15:23:15.346] ./src/app/api/admin/products/[id]/relations/route.ts
[15:23:15.346] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:23:15.346] 
[15:23:15.346] Import trace for requested module:
[15:23:15.346] ./src/app/api/admin/products/[id]/relations/route.ts
[15:23:15.346] 
[15:23:15.347] ./src/app/api/admin/products/relations/[id]/route.ts
[15:23:15.347] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:23:15.347] 
[15:23:15.347] Import trace for requested module:
[15:23:15.348] ./src/app/api/admin/products/relations/[id]/route.ts
[15:23:15.348] 
[15:23:15.348] ./src/app/api/admin/products/relations/route.ts
[15:23:15.348] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:23:15.349] 
[15:23:15.349] Import trace for requested module:
[15:23:15.349] ./src/app/api/admin/products/relations/route.ts
[15:23:15.349] 
[15:23:15.349] ./src/app/api/admin/stock/adjust/route.ts
[15:23:15.349] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:23:15.349] 
[15:23:15.350] Import trace for requested module:
[15:23:15.350] ./src/app/api/admin/stock/adjust/route.ts
[15:23:15.350] 
[15:23:15.350] ./src/app/api/admin/stock/history/route.ts
[15:23:15.350] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:23:15.350] 
[15:23:15.350] Import trace for requested module:
[15:23:15.351] ./src/app/api/admin/stock/history/route.ts
[15:23:15.351] 
[15:23:15.351] ./src/app/api/admin/stock/movements/[productId]/route.ts
[15:23:15.351] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:23:15.351] 
[15:23:15.351] Import trace for requested module:
[15:23:15.351] ./src/app/api/admin/stock/movements/[productId]/route.ts
[15:23:15.351] 
[15:23:18.600] <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (149kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
[15:23:29.201]  ✓ Compiled successfully in 27.0s
[15:23:29.206]    Linting and checking validity of types ...
[15:23:41.439] 
[15:23:41.439] Failed to compile.
[15:23:41.449] 
[15:23:41.450] ./src/app/admin/analytics/page.tsx
[15:23:41.450] 106:6  Warning: React Hook useEffect has a missing dependency: 'fetchAnalytics'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.450] 129:14  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.451] 205:55  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.451] 
[15:23:41.451] ./src/app/admin/coupons/nuevo/page.tsx
[15:23:41.451] 189:96  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.451] 416:96  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.452] 
[15:23:41.452] ./src/app/admin/coupons/page.tsx
[15:23:41.452] 73:9  Error: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.452] 88:6  Warning: React Hook useEffect has a missing dependency: 'fetchCoupons'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.453] 
[15:23:41.453] ./src/app/admin/layout.tsx
[15:23:41.453] 4:8  Error: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.453] 5:10  Error: 'UserButton' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.453] 7:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.454] 8:3  Error: 'FolderOpen' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.454] 9:3  Error: 'ShoppingCart' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.454] 10:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.454] 11:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.455] 12:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.455] 13:3  Error: 'Monitor' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.456] 14:3  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.456] 15:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.459] 16:3  Error: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.459] 17:3  Error: 'ChevronRight' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.459] 
[15:23:41.459] ./src/app/admin/stock/page.tsx
[15:23:41.459] 1:10  Error: 'Suspense' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.460] 7:10  Error: 'StockHistory' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.460] 
[15:23:41.460] ./src/app/api/admin/analytics/customers/route.ts
[15:23:41.460] 229:46  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.461] 
[15:23:41.461] ./src/app/api/admin/analytics/products/route.ts
[15:23:41.461] 188:41  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.461] 
[15:23:41.461] ./src/app/api/admin/analytics/sales/route.ts
[15:23:41.469] 22:21  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.469] 
[15:23:41.469] ./src/app/api/admin/cleanup/route.ts
[15:23:41.470] 1:10  Error: 'NextRequest' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.471] 
[15:23:41.472] ./src/app/api/admin/coupons/route.ts
[15:23:41.472] 27:7  Error: 'updateCouponSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.472] 48:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.472] 
[15:23:41.472] ./src/app/api/admin/orders/[id]/route.ts
[15:23:41.472] 85:55  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.472] 
[15:23:41.472] ./src/app/api/loyalty/points/route.ts
[15:23:41.472] 25:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.472] 
[15:23:41.472] ./src/app/api/mercadopago/create-preference/route.ts
[15:23:41.472] 17:41  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.473] 41:38  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.473] 
[15:23:41.473] ./src/app/api/mercadopago/payment-methods/route.ts
[15:23:41.473] 7:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.473] 
[15:23:41.473] ./src/app/api/mercadopago/process-payment/route.ts
[15:23:41.473] 140:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.473] 145:39  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.473] 
[15:23:41.474] ./src/app/api/mercadopago/webhook/route.ts
[15:23:41.474] 82:11  Error: 'updatedOrder' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.474] 
[15:23:41.474] ./src/app/api/orders/route.ts
[15:23:41.474] 341:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.474] 
[15:23:41.475] ./src/app/api/products/[id]/route.ts
[15:23:41.475] 118:23  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.476] 
[15:23:41.476] ./src/app/api/products/route.ts
[15:23:41.476] 45:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.476] 79:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.476] 
[15:23:41.476] ./src/app/api/user/coupons/route.ts
[15:23:41.476] 7:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.476] 
[15:23:41.476] ./src/app/api/user/profile/route.ts
[15:23:41.476] 19:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.476] 
[15:23:41.476] ./src/app/api/webhooks/clerk/route.ts
[15:23:41.476] 49:9  Error: 'body' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.477] 
[15:23:41.477] ./src/app/api/wishlist/route.ts
[15:23:41.477] 12:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.477] 
[15:23:41.477] ./src/app/carrito/page.tsx
[15:23:41.477] 28:24  Error: 'setIsProcessing' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.477] 
[15:23:41.477] ./src/app/checkout/pending/page.tsx
[15:23:41.477] 48:48  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:23:41.477] 48:60  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:23:41.477] 
[15:23:41.477] ./src/app/checkout/transfer/page.tsx
[15:23:41.477] 34:6  Warning: React Hook useEffect has a missing dependency: 'updateOrderStatus'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.477] 
[15:23:41.478] ./src/app/contacto/page.tsx
[15:23:41.478] 5:25  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 30:9  Error: 'phone' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 31:9  Error: 'email' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 
[15:23:41.478] ./src/app/page.tsx
[15:23:41.478] 8:84  Error: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 10:46  Error: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 18:5  Error: 'userIsAdmin' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 
[15:23:41.478] ./src/app/productos/[slug]/page.tsx
[15:23:41.478] 2:8  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 6:21  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 183:55  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.478] 
[15:23:41.478] ./src/app/sobre-nosotros/page.tsx
[15:23:41.478] 4:10  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 128:31  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 215:45  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.478] 234:53  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:23:41.479] 234:75  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:23:41.479] 248:40  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.479] 
[15:23:41.479] ./src/components/admin/admin-sidebar.tsx
[15:23:41.479] 37:9  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.479] 41:11  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.479] 
[15:23:41.479] ./src/components/admin/analytics-charts.tsx
[15:23:41.479] 4:10  Error: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.479] 6:31  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.479] 
[15:23:41.479] ./src/components/admin/notification-settings.tsx
[15:23:41.479] 5:10  Error: 'Card' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.479] 
[15:23:41.479] ./src/components/admin/product-form.tsx
[15:23:41.479] 10:18  Error: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.479] 10:21  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.479] 11:8  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.479] 110:5  Error: 'setValue' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.479] 
[15:23:41.480] ./src/components/admin/product-relations.tsx
[15:23:41.480] 121:6  Warning: React Hook useEffect has a missing dependency: 'fetchRelations'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.480] 129:6  Warning: React Hook useEffect has a missing dependency: 'searchProducts'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.480] 
[15:23:41.480] ./src/components/admin/product-variations.tsx
[15:23:41.480] 83:81  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.480] 136:45  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.480] 188:51  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.480] 
[15:23:41.480] ./src/components/admin/stock-alerts.tsx
[15:23:41.480] Error: Parsing error: File appears to be binary.
[15:23:41.480] 
[15:23:41.480] ./src/components/admin/stock-history.tsx
[15:23:41.480] 4:44  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.480] 98:6  Warning: React Hook useEffect has a missing dependency: 'fetchMovements'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.480] 
[15:23:41.480] ./src/components/admin/store-settings-form.tsx
[15:23:41.480] 10:10  Error: 'StoreSettings' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.480] 20:9  Error: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.481] 47:6  Warning: React Hook useEffect has a missing dependency: 'fetchSettings'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.481] 74:52  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.482] 78:68  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.484] 
[15:23:41.484] ./src/components/client/advanced-filters.tsx
[15:23:41.484] 262:29  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:23:41.484] 262:46  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:23:41.484] 
[15:23:41.484] ./src/components/client/bank-transfer.tsx
[15:23:41.484] Error: Parsing error: File appears to be binary.
[15:23:41.484] 
[15:23:41.485] ./src/components/client/checkout-form.tsx
[15:23:41.487] 37:25  Error: 'clearCart' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.487] 38:11  Error: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.488] 441:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[15:23:41.488] 
[15:23:41.488] ./src/components/client/featured-products.tsx
[15:23:41.488] 7:10  Error: 'VariationType' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.488] 10:62  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.489] 
[15:23:41.489] ./src/components/client/guest-info-form.tsx
[15:23:41.489] 17:20  Error: 'guestInfo' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.489] 
[15:23:41.489] ./src/components/client/mercadopago-payment.tsx
[15:23:41.489] 13:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.490] 35:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.490] 50:6  Warning: React Hook useEffect has a missing dependency: 'loadMercadoPagoSDK'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.490] 189:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.490] 193:26  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.490] 199:77  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.490] 287:11  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[15:23:41.491] 
[15:23:41.493] ./src/components/client/payment-options.tsx
[15:23:41.493] 160:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[15:23:41.493] 
[15:23:41.493] ./src/components/client/product-variations-selector.tsx
[15:23:41.493] 40:6  Warning: React Hook useEffect has a missing dependency: 'selectedVariations'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.498] 
[15:23:41.498] ./src/components/client/products-grid.tsx
[15:23:41.499] 93:6  Warning: React Hook useEffect has a missing dependency: 'fetchProducts'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.499] 
[15:23:41.500] ./src/components/client/profile-form.tsx
[15:23:41.500] 18:3  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.500] 72:41  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.500] 
[15:23:41.501] ./src/components/client/recently-viewed.tsx
[15:23:41.501] 34:37  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.501] 
[15:23:41.501] ./src/components/client/stock-indicator.tsx
[15:23:41.501] 45:6  Warning: React Hook useEffect has a missing dependency: 'refreshStock'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.502] 135:6  Warning: React Hook useEffect has a missing dependency: 'validateStock'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.503] 
[15:23:41.503] ./src/components/providers/cart-provider.tsx
[15:23:41.503] 72:6  Warning: React Hook useEffect has a missing dependency: 'reserveCartStock'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.503] 
[15:23:41.504] ./src/components/shared/footer.tsx
[15:23:41.504] 56:9  Error: 'phone' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.504] 
[15:23:41.504] ./src/components/shared/navbar.tsx
[15:23:41.504] 7:42  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[15:23:41.505] 
[15:23:41.505] ./src/components/ui/input.tsx
[15:23:41.505] 4:18  Error: An interface declaring no members is equivalent to its supertype.  @typescript-eslint/no-empty-object-type
[15:23:41.516] 
[15:23:41.517] ./src/components/ui/textarea.tsx
[15:23:41.517] 4:18  Error: An interface declaring no members is equivalent to its supertype.  @typescript-eslint/no-empty-object-type
[15:23:41.517] 
[15:23:41.518] ./src/hooks/use-analytics.ts
[15:23:41.518] 6:10  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.518] 7:13  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.518] 8:14  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.519] 
[15:23:41.519] ./src/hooks/use-loyalty.ts
[15:23:41.519] 77:6  Warning: React Hook useEffect has a missing dependency: 'fetchLoyaltyData'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.520] 
[15:23:41.520] ./src/hooks/use-stock-validation.ts
[15:23:41.520] 100:6  Warning: React Hook useEffect has a missing dependency: 'checkStock'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.520] 
[15:23:41.524] ./src/hooks/use-wishlist.ts
[15:23:41.524] 61:6  Warning: React Hook useEffect has a missing dependency: 'refreshWishlist'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:23:41.524] 
[15:23:41.524] ./src/lib/stock-reservation.ts
[15:23:41.524] 84:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.524] 
[15:23:41.524] ./src/lib/stock.ts
[15:23:41.524] 122:3  Error: 'expirationMinutes' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:23:41.524] 
[15:23:41.524] ./src/types/index.ts
[15:23:41.524] 220:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:23:41.524] 
[15:23:41.524] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[15:23:41.527] Error: Command "npm run build" exited with 1
[15:23:41.792] 
[15:23:44.810] Exiting build container