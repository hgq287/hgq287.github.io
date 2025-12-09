import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

type PostMeta = { slug:string; title:string; date:string; excerpt?:string; cover?:string }

export default async function BlogPage(){
  const postsDir = path.join(process.cwd(), 'posts')
  console.log('Posts directory:', postsDir);
  const hasPosts = fs.existsSync(postsDir) && fs.readdirSync(postsDir).some(f => f.endsWith('.md'))

  if(!hasPosts) {
    return (
      <section style={{textAlign:'center', marginTop:50, color:'var(--color-text)'}}>
        <h3 style={{fontWeight: 300}}>No blog posts found.</h3>
      </section>
    )
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  const posts:PostMeta[] = files.map(f=>{
    const raw = fs.readFileSync(path.join(postsDir,f),'utf-8')
    const { data } = matter(raw)
    return { slug: f.replace('.md',''), title: data.title, date: data.date, excerpt: data.excerpt || '', cover: data.cover || '' }
  }).sort((a,b)=> (a.date < b.date ? 1 : -1))

  return (
    <section>
      <h1>📝 Blog</h1>
      <div style={{height:10}} />
      <div className="blog-list">
        {posts.map(p=>(
          <article key={p.slug} className="blog-card">
            <h3><Link href={`/blog/${p.slug}`} style={{color:'var(--color-accent)', textDecoration:'none'}}>{p.title}</Link></h3>
            <div className="blog-meta">{new Date(p.date).toLocaleDateString()}</div>
            {p.excerpt ? <p style={{marginTop:8,color:'#ccc'}}>{p.excerpt}</p> : null}
          </article>
        ))}
      </div>
    </section>
  )
}
