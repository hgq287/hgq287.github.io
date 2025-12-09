import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'public/content')

export function getAllPosts() {
  const postsDir = path.join(contentDir, 'posts')
  if (!fs.existsSync(postsDir)) {
    return []
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  const posts = files.map(f => {
    const raw = fs.readFileSync(path.join(postsDir, f), 'utf-8')
    const { data } = matter(raw)
    return { slug: f.replace('.md', ''), title: data.title, date: data.date }
  }).sort((a, b) => (a.date < b.date ? 1 : -1))

  return posts
}

export function getPostBySlug(slug: string) {
  const postsDir = path.join(contentDir, 'posts')
  const filePath = path.join(postsDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return { slug, title: data.title, date: data.date, content }
}