import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/site/Layout'
import CatalogLayout from '@/site/CatalogLayout'
import Home from '@/pages/Home'
import Components from '@/pages/Components'
import Detail from '@/pages/Detail'
import NotFound from '@/pages/NotFound'
import { lazyRetry } from '@/lib/lazyRetry'
import { Loading } from '@/site/Preview'

const Blocks = lazyRetry(() => import('@/pages/Blocks'))
const Backgrounds = lazyRetry(() => import('@/pages/Backgrounds'))
const Docs = lazyRetry(() => import('@/pages/Docs'))
const Blog = lazyRetry(() => import('@/pages/Blog'))
const BlogPost = lazyRetry(() => import('@/pages/BlogPost'))
const Info = lazyRetry(() => import('@/pages/Info'))

const Page = ({ children }) => <Suspense fallback={<div className="relative min-h-[70vh]"><Loading label="Loading" /></div>}>{children}</Suspense>

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route element={<CatalogLayout />}>
          <Route path="components" element={<Components />} />
          <Route path="components/:slug" element={<Detail />} />
          <Route path="blocks" element={<Page><Blocks /></Page>} />
          <Route path="backgrounds" element={<Page><Backgrounds /></Page>} />
        </Route>
        <Route path="docs" element={<Page><Docs /></Page>} />
        <Route path="docs/:page" element={<Page><Docs /></Page>} />
        <Route path="blog" element={<Page><Blog /></Page>} />
        <Route path="blog/:slug" element={<Page><BlogPost /></Page>} />
        <Route path="about" element={<Page><Info page="about" /></Page>} />
        <Route path="privacy" element={<Page><Info page="privacy" /></Page>} />
        <Route path="terms" element={<Page><Info page="terms" /></Page>} />
        <Route path="gradients" element={<Navigate to="/backgrounds" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
