# GitHub Stats SVG (Edge Function)

Custom GitHub profile stats berbasis **SVG + Edge Function**, dirender langsung di README menggunakan URL endpoint.
Menggunakan **GitHub REST + GraphQL API** dan **Dracula dark theme**.

---

## 📌 Tujuan

- Menampilkan statistik GitHub **tanpa frontend**
- Ringan, cepat, dan **compatible dengan GitHub README**
- Mudah dikustomisasi (warna, layout, data)

---

## ⚙️ Teknologi

- **Next.js App Router**
- **Edge Runtime**
- **GitHub REST API**
- **GitHub GraphQL API**
- **Pure SVG (no JS, no CSS external)**

---

## 🔐 Environment Variable

Wajib set token GitHub agar tidak kena rate limit.

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxx
```

> Token hanya butuh akses **public data**.

---

## 🧩 Endpoint

```txt
/api/card/{username}
```

### Contoh

```md
![GitHub Stats](https://your-domain.vercel.app/api/card/username)
```

---

## 📊 Data yang Ditampilkan

- Total Public Repositories
- Total Stars (akumulasi)
- Total Forks (akumulasi)
- Total Commits
- Total Pull Requests
- Total Merged PRs
- Total Issues
- Contributions (last year)
- Followers & Following
- Avatar & Username

---

## 🎨 Design

- Theme: **Dracula (dark, low-contrast)**
- Subtle border (no glow berlebihan)
- SVG icon inline (Feather-style)
- Aman untuk GitHub Markdown renderer

---

## 🧠 Catatan Teknis Penting

- GraphQL `repositories(first: 100)` **hanya ambil 100 repo**
- User dengan repo >100 **tidak terhitung full**
- Contributions tergantung data GitHub (bukan real-time)

---

## 📝 TODO / Pengingat Update ke Depan

> **Jangan lupa ini kalau balik ke project ini nanti**

- [ ] Pagination GraphQL untuk repo >100
- [ ] Mode `compact` / `full` via query param
- [ ] Theme switch (`dark`, `dracula`, `mono`)
- [ ] Cache strategy (etag / conditional request)
- [ ] Optional: badge-only version
- [ ] Optional: hide stats jika value = 0
- [ ] Optional: locale / language support

---

## ⚠️ Known Limitations

- Tidak bisa pakai React / FE
- SVG tidak support external JS / CSS
- Rate limit tetap ada kalau endpoint sering di-hit

---

## 🧪 Testing

- Test langsung via browser
- Test render di GitHub README
- Test tanpa token (harus error)

---

## 📦 Deployment

Direkomendasikan:

- **Vercel (Edge Function)**
- Cloudflare Workers (alternatif)
