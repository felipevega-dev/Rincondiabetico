[15:02:42.471] Running build in Washington, D.C., USA (East) – iad1
[15:02:42.472] Build machine configuration: 2 cores, 8 GB
[15:02:42.492] Cloning github.com/felipevega-dev/Rincondiabetico (Branch: main, Commit: f82b084)
[15:02:42.637] Previous build caches not available
[15:02:43.762] Cloning completed: 1.270s
[15:02:46.131] Running "vercel build"
[15:02:46.764] Vercel CLI 44.6.4
[15:02:47.096] Installing dependencies...
[15:03:06.344] 
[15:03:06.344] added 502 packages in 19s
[15:03:06.344] 
[15:03:06.344] 162 packages are looking for funding
[15:03:06.345]   run `npm fund` for details
[15:03:06.537] Detected Next.js version: 15.3.4
[15:03:06.543] Running "npm run build"
[15:03:06.671] 
[15:03:06.671] > rincondiabetico@0.1.0 build
[15:03:06.672] > next build
[15:03:06.672] 
[15:03:07.320] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[15:03:07.321] This information is used to shape Next.js' roadmap and prioritize features.
[15:03:07.324] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[15:03:07.325] https://nextjs.org/telemetry
[15:03:07.325] 
[15:03:07.417]    ▲ Next.js 15.3.4
[15:03:07.422] 
[15:03:07.455]    Creating an optimized production build ...
[15:03:24.614]  ⚠ Compiled with warnings in 16.0s
[15:03:24.615] 
[15:03:24.616] ./src/app/api/admin/products/[id]/relations/route.ts
[15:03:24.616] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:03:24.616] 
[15:03:24.617] Import trace for requested module:
[15:03:24.617] ./src/app/api/admin/products/[id]/relations/route.ts
[15:03:24.617] 
[15:03:24.617] ./src/app/api/admin/products/relations/[id]/route.ts
[15:03:24.618] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:03:24.618] 
[15:03:24.618] Import trace for requested module:
[15:03:24.619] ./src/app/api/admin/products/relations/[id]/route.ts
[15:03:24.619] 
[15:03:24.619] ./src/app/api/admin/products/relations/route.ts
[15:03:24.619] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:03:24.620] 
[15:03:24.620] Import trace for requested module:
[15:03:24.620] ./src/app/api/admin/products/relations/route.ts
[15:03:24.620] 
[15:03:24.621] ./src/app/api/admin/stock/adjust/route.ts
[15:03:24.621] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:03:24.621] 
[15:03:24.622] Import trace for requested module:
[15:03:24.622] ./src/app/api/admin/stock/adjust/route.ts
[15:03:24.622] 
[15:03:24.622] ./src/app/api/admin/stock/history/route.ts
[15:03:24.623] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:03:24.623] 
[15:03:24.623] Import trace for requested module:
[15:03:24.624] ./src/app/api/admin/stock/history/route.ts
[15:03:24.624] 
[15:03:24.624] ./src/app/api/admin/stock/movements/[productId]/route.ts
[15:03:24.625] Attempted import error: 'auth' is not exported from '@clerk/nextjs' (imported as 'auth').
[15:03:24.625] 
[15:03:24.625] Import trace for requested module:
[15:03:24.626] ./src/app/api/admin/stock/movements/[productId]/route.ts
[15:03:24.626] 
[15:03:27.858] <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (149kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
[15:03:38.599]  ✓ Compiled successfully in 27.0s
[15:03:38.604]    Linting and checking validity of types ...
[15:03:51.269] 
[15:03:51.277] Failed to compile.
[15:03:51.278] 
[15:03:51.278] ./src/app/admin/analytics/page.tsx
[15:03:51.280] 106:6  Warning: React Hook useEffect has a missing dependency: 'fetchAnalytics'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.281] 129:14  Error: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.281] 205:55  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.281] 
[15:03:51.281] ./src/app/admin/coupons/nuevo/page.tsx
[15:03:51.282] 189:96  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.282] 416:96  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.282] 
[15:03:51.283] ./src/app/admin/coupons/page.tsx
[15:03:51.283] 73:9  Error: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.283] 88:6  Warning: React Hook useEffect has a missing dependency: 'fetchCoupons'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.285] 
[15:03:51.288] ./src/app/admin/layout.tsx
[15:03:51.289] 4:8  Error: 'Link' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.289] 5:10  Error: 'UserButton' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.289] 7:3  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.290] 8:3  Error: 'FolderOpen' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.290] 9:3  Error: 'ShoppingCart' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.290] 10:3  Error: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.291] 11:3  Error: 'BarChart3' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.291] 12:3  Error: 'Home' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.292] 13:3  Error: 'Monitor' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.292] 14:3  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.292] 15:3  Error: 'Settings' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.295] 16:3  Error: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.295] 17:3  Error: 'ChevronRight' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.296] 
[15:03:51.296] ./src/app/admin/stock/page.tsx
[15:03:51.296] 1:10  Error: 'Suspense' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.297] 7:10  Error: 'StockHistory' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.297] 
[15:03:51.297] ./src/app/api/admin/analytics/customers/route.ts
[15:03:51.297] 229:46  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.297] 
[15:03:51.297] ./src/app/api/admin/analytics/products/route.ts
[15:03:51.297] 188:41  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.297] 
[15:03:51.297] ./src/app/api/admin/analytics/sales/route.ts
[15:03:51.297] 22:21  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.297] 
[15:03:51.297] ./src/app/api/admin/cleanup/route.ts
[15:03:51.297] 1:10  Error: 'NextRequest' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.297] 
[15:03:51.297] ./src/app/api/admin/coupons/route.ts
[15:03:51.297] 27:7  Error: 'updateCouponSchema' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.297] 48:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.297] 
[15:03:51.297] ./src/app/api/admin/orders/[id]/route.ts
[15:03:51.297] 85:55  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.297] 
[15:03:51.297] ./src/app/api/loyalty/points/route.ts
[15:03:51.297] 25:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.297] 
[15:03:51.297] ./src/app/api/mercadopago/create-preference/route.ts
[15:03:51.298] 17:41  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.298] 41:38  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.298] 
[15:03:51.298] ./src/app/api/mercadopago/payment-methods/route.ts
[15:03:51.298] 7:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.298] 
[15:03:51.298] ./src/app/api/mercadopago/process-payment/route.ts
[15:03:51.298] 140:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.298] 145:39  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.298] 
[15:03:51.298] ./src/app/api/mercadopago/webhook/route.ts
[15:03:51.298] 82:11  Error: 'updatedOrder' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.298] 
[15:03:51.298] ./src/app/api/orders/route.ts
[15:03:51.298] 341:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.298] 
[15:03:51.298] ./src/app/api/products/[id]/route.ts
[15:03:51.298] 118:23  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.298] 
[15:03:51.298] ./src/app/api/products/route.ts
[15:03:51.305] 45:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.305] 79:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.305] 
[15:03:51.305] ./src/app/api/user/coupons/route.ts
[15:03:51.305] 7:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.305] 
[15:03:51.306] ./src/app/api/user/profile/route.ts
[15:03:51.306] 19:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 
[15:03:51.306] ./src/app/api/webhooks/clerk/route.ts
[15:03:51.306] 49:9  Error: 'body' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 
[15:03:51.306] ./src/app/api/wishlist/route.ts
[15:03:51.306] 12:27  Error: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 
[15:03:51.306] ./src/app/carrito/page.tsx
[15:03:51.306] 28:24  Error: 'setIsProcessing' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 
[15:03:51.306] ./src/app/checkout/pending/page.tsx
[15:03:51.306] 48:48  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:03:51.306] 48:60  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:03:51.306] 
[15:03:51.306] ./src/app/checkout/transfer/page.tsx
[15:03:51.306] 34:6  Warning: React Hook useEffect has a missing dependency: 'updateOrderStatus'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.306] 
[15:03:51.306] ./src/app/contacto/page.tsx
[15:03:51.306] 5:25  Error: 'Phone' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 30:9  Error: 'phone' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 31:9  Error: 'email' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 
[15:03:51.306] ./src/app/page.tsx
[15:03:51.306] 8:84  Error: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 10:46  Error: 'CardHeader' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 18:5  Error: 'userIsAdmin' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 
[15:03:51.306] ./src/app/productos/[slug]/page.tsx
[15:03:51.306] 2:8  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 6:21  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 183:55  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.306] 
[15:03:51.306] ./src/app/sobre-nosotros/page.tsx
[15:03:51.306] 4:10  Error: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.306] 128:31  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.310] 215:45  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.310] 234:53  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:03:51.310] 234:75  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:03:51.310] 248:40  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.310] 
[15:03:51.310] ./src/components/admin/admin-sidebar.tsx
[15:03:51.310] 37:9  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.310] 41:11  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.310] 
[15:03:51.310] ./src/components/admin/analytics-charts.tsx
[15:03:51.310] 4:10  Error: 'Badge' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.310] 6:31  Error: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.310] 
[15:03:51.310] ./src/components/admin/notification-settings.tsx
[15:03:51.310] 5:10  Error: 'Card' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.310] 
[15:03:51.310] ./src/components/admin/product-form.tsx
[15:03:51.310] 10:18  Error: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.310] 10:21  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.311] 11:8  Error: 'Image' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.311] 110:5  Error: 'setValue' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.312] 
[15:03:51.312] ./src/components/admin/product-relations.tsx
[15:03:51.312] 121:6  Warning: React Hook useEffect has a missing dependency: 'fetchRelations'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.312] 129:6  Warning: React Hook useEffect has a missing dependency: 'searchProducts'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.312] 
[15:03:51.312] ./src/components/admin/product-variations.tsx
[15:03:51.312] 83:81  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.312] 136:45  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.312] 188:51  Error: 'index' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.312] 
[15:03:51.312] ./src/components/admin/stock-alerts.tsx
[15:03:51.312] Error: Parsing error: File appears to be binary.
[15:03:51.312] 
[15:03:51.312] ./src/components/admin/stock-history.tsx
[15:03:51.312] 4:44  Error: 'User' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.312] 98:6  Warning: React Hook useEffect has a missing dependency: 'fetchMovements'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.312] 
[15:03:51.312] ./src/components/admin/store-settings-form.tsx
[15:03:51.312] 10:10  Error: 'StoreSettings' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.312] 20:9  Error: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.312] 47:6  Warning: React Hook useEffect has a missing dependency: 'fetchSettings'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.313] 74:52  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.313] 78:68  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.313] 
[15:03:51.313] ./src/components/client/advanced-filters.tsx
[15:03:51.313] 262:29  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:03:51.313] 262:46  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[15:03:51.313] 
[15:03:51.313] ./src/components/client/bank-transfer.tsx
[15:03:51.313] Error: Parsing error: File appears to be binary.
[15:03:51.313] 
[15:03:51.313] ./src/components/client/checkout-form.tsx
[15:03:51.313] 37:25  Error: 'clearCart' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.313] 38:11  Error: 'user' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.313] 441:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[15:03:51.313] 
[15:03:51.313] ./src/components/client/featured-products.tsx
[15:03:51.314] 7:10  Error: 'VariationType' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.314] 10:62  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.314] 
[15:03:51.314] ./src/components/client/guest-info-form.tsx
[15:03:51.314] 17:20  Error: 'guestInfo' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.314] 
[15:03:51.315] ./src/components/client/mercadopago-payment.tsx
[15:03:51.315] 13:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.315] 35:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.315] 50:6  Warning: React Hook useEffect has a missing dependency: 'loadMercadoPagoSDK'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.315] 189:25  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.315] 193:26  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.315] 199:77  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.316] 287:11  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[15:03:51.316] 
[15:03:51.316] ./src/components/client/payment-options.tsx
[15:03:51.316] 160:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
[15:03:51.316] 
[15:03:51.316] ./src/components/client/product-variations-selector.tsx
[15:03:51.316] 40:6  Warning: React Hook useEffect has a missing dependency: 'selectedVariations'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.316] 
[15:03:51.316] ./src/components/client/products-grid.tsx
[15:03:51.316] 93:6  Warning: React Hook useEffect has a missing dependency: 'fetchProducts'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.316] 
[15:03:51.317] ./src/components/client/profile-form.tsx
[15:03:51.317] 18:3  Error: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.317] 72:41  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.317] 
[15:03:51.317] ./src/components/client/recently-viewed.tsx
[15:03:51.317] 34:37  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.317] 
[15:03:51.317] ./src/components/client/stock-indicator.tsx
[15:03:51.317] 45:6  Warning: React Hook useEffect has a missing dependency: 'refreshStock'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.317] 135:6  Warning: React Hook useEffect has a missing dependency: 'validateStock'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.317] 
[15:03:51.317] ./src/components/providers/cart-provider.tsx
[15:03:51.317] 72:6  Warning: React Hook useEffect has a missing dependency: 'reserveCartStock'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.317] 
[15:03:51.317] ./src/components/shared/footer.tsx
[15:03:51.317] 56:9  Error: 'phone' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.318] 
[15:03:51.318] ./src/components/shared/navbar.tsx
[15:03:51.318] 7:42  Error: 'Package' is defined but never used.  @typescript-eslint/no-unused-vars
[15:03:51.318] 
[15:03:51.318] ./src/components/ui/input.tsx
[15:03:51.318] 4:18  Error: An interface declaring no members is equivalent to its supertype.  @typescript-eslint/no-empty-object-type
[15:03:51.320] 
[15:03:51.320] ./src/components/ui/textarea.tsx
[15:03:51.320] 4:18  Error: An interface declaring no members is equivalent to its supertype.  @typescript-eslint/no-empty-object-type
[15:03:51.320] 
[15:03:51.320] ./src/hooks/use-analytics.ts
[15:03:51.321] 6:10  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.321] 7:13  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.321] 8:14  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.321] 
[15:03:51.321] ./src/hooks/use-loyalty.ts
[15:03:51.322] 77:6  Warning: React Hook useEffect has a missing dependency: 'fetchLoyaltyData'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.322] 
[15:03:51.322] ./src/hooks/use-stock-validation.ts
[15:03:51.322] 100:6  Warning: React Hook useEffect has a missing dependency: 'checkStock'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.322] 
[15:03:51.322] ./src/hooks/use-wishlist.ts
[15:03:51.322] 61:6  Warning: React Hook useEffect has a missing dependency: 'refreshWishlist'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[15:03:51.325] 
[15:03:51.325] ./src/lib/stock-reservation.ts
[15:03:51.325] 84:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.325] 
[15:03:51.325] ./src/lib/stock.ts
[15:03:51.325] 122:3  Error: 'expirationMinutes' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[15:03:51.325] 
[15:03:51.325] ./src/types/index.ts
[15:03:51.325] 220:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[15:03:51.326] 
[15:03:51.326] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[15:03:51.343] Error: Command "npm run build" exited with 1
[15:03:51.642] 
[15:03:54.726] Exiting build container