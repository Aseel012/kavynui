import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import AvatarUpload from '@/kavyn/avatar-upload'
import Dropzone from '@/kavyn/dropzone'

const img = (name = 'me.png', size = 1000, type = 'image/png') => new File([new Uint8Array(size)], name, { type })
const pick = (container, file) => fireEvent.change(container.querySelector('input[type=file]'), { target: { files: [file] } })
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b }); return { promise, resolve, reject } }

describe('AvatarUpload', () => {
  it('starts empty with an upload action and a hint', () => {
    render(<AvatarUpload />)
    expect(screen.getByRole('button', { name: 'Upload profile photo' })).toBeTruthy()
    expect(screen.getByText(/Drop or click/)).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Remove' })).toBeNull()
  })

  it('rejects files that are not images', async () => {
    const onUpload = vi.fn()
    const { container } = render(<AvatarUpload onUpload={onUpload} />)
    pick(container, img('notes.txt', 10, 'text/plain'))
    expect(await screen.findByText('Choose a JPG, PNG or WebP image.')).toBeTruthy()
    expect(onUpload).not.toHaveBeenCalled()
  })

  it('rejects images over the size limit', async () => {
    const onUpload = vi.fn()
    const { container } = render(<AvatarUpload onUpload={onUpload} maxSizeMB={1} />)
    pick(container, img('big.png', 1_100_000))
    expect(await screen.findByText('That photo is over 1 MB.')).toBeTruthy()
    expect(onUpload).not.toHaveBeenCalled()
  })

  it('uploads, reports progress, saves, then removes', async () => {
    const d = deferred()
    const onUpload = vi.fn((file, progress) => { progress(0.5); return d.promise })
    const onChange = vi.fn()
    const file = img()
    const { container } = render(<AvatarUpload onUpload={onUpload} onChange={onChange} />)
    pick(container, file)
    expect(onUpload).toHaveBeenCalledWith(file, expect.any(Function))
    expect(await screen.findByText('Uploading…')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Replace profile photo' }).disabled).toBe(true)
    await act(async () => d.resolve())
    await waitFor(() => expect(screen.getByText('Saved')).toBeTruthy())
    expect(onChange).toHaveBeenCalledWith(file)
    expect(container.querySelector('img').getAttribute('alt')).toBe('Profile photo')
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(onChange).toHaveBeenLastCalledWith(null)
    // The empty state is reachable immediately; the old photo fades out over its exit animation.
    expect(screen.getByRole('button', { name: 'Upload profile photo' })).toBeTruthy()
    await waitFor(() => expect(container.querySelector('img')).toBeNull(), { timeout: 2000 })
  })

  it('shows the server error when an upload fails', async () => {
    const { container } = render(<AvatarUpload onUpload={() => Promise.reject(new Error('Storage is full'))} />)
    pick(container, img())
    await waitFor(() => expect(screen.getByText('Storage is full')).toBeTruthy())
  })

  it('ignores a slow first upload once a second photo replaces it', async () => {
    const first = deferred()
    const onUpload = vi.fn().mockReturnValueOnce(first.promise).mockResolvedValueOnce()
    const onChange = vi.fn()
    const a = img('a.png'), b = img('b.png')
    const { container } = render(<AvatarUpload onUpload={onUpload} onChange={onChange} />)
    pick(container, a)
    // The button is disabled while busy, but a drop can still arrive.
    fireEvent.drop(container.querySelector('svg').parentElement, { dataTransfer: { files: [b] } })
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(b))
    await act(async () => first.resolve())
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('opens in the saved state when given an existing photo', () => {
    const { container } = render(<AvatarUpload initialSrc="/me.jpg" />)
    expect(container.querySelector('img').getAttribute('src')).toBe('/me.jpg')
    expect(screen.getByText('Saved')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Remove' })).toBeTruthy()
  })
})

describe('Dropzone', () => {
  it('uploads a file through onUpload and counts it done', async () => {
    const d = deferred()
    const { container } = render(<Dropzone onUpload={() => d.promise} />)
    expect(screen.getByText('No files yet')).toBeTruthy()
    pick(container, img('report.pdf', 2e6, 'application/pdf'))
    expect(screen.getByText('report.pdf')).toBeTruthy()
    expect(screen.getByText(/Uploading 1 of 1/)).toBeTruthy()
    await act(async () => d.resolve())
    await waitFor(() => expect(screen.getByText('1 of 1 uploaded')).toBeTruthy())
  })

  it('shows small files in KB and large ones in MB', async () => {
    const { container } = render(<Dropzone onUpload={() => Promise.resolve()} />)
    pick(container, img('tiny.svg', 1200, 'image/svg+xml')); pick(container, img('big.pdf', 4_200_000, 'application/pdf'))
    await waitFor(() => expect(screen.getByText('2 of 2 uploaded')).toBeTruthy())
    expect(screen.getByText('1 KB')).toBeTruthy()
    expect(screen.getByText('4.2 MB')).toBeTruthy()
  })

  it('marks files over the limit without uploading them', () => {
    const onUpload = vi.fn(() => new Promise(() => {}))
    const { container } = render(<Dropzone maxSizeMB={1} onUpload={onUpload} />)
    pick(container, img('huge.mov', 2e6, 'video/quicktime'))
    expect(screen.getByText('Too large – max 1 MB')).toBeTruthy()
    expect(onUpload).not.toHaveBeenCalled()
  })

  it('offers retry after a failure and uploads again', async () => {
    const onUpload = vi.fn().mockRejectedValueOnce(new Error('Network dropped')).mockResolvedValueOnce()
    const { container } = render(<Dropzone onUpload={onUpload} />)
    pick(container, img('a.png'))
    await waitFor(() => expect(screen.getByText('Network dropped')).toBeTruthy())
    fireEvent.click(screen.getByRole('button', { name: 'Retry upload' }))
    await waitFor(() => expect(screen.getByText('1 of 1 uploaded')).toBeTruthy())
    expect(onUpload).toHaveBeenCalledTimes(2)
  })

  it('removes one file, and clears all', async () => {
    const { container } = render(<Dropzone onUpload={() => Promise.resolve()} />)
    pick(container, img('a.png')); pick(container, img('b.png'))
    await waitFor(() => expect(screen.getByText('2 of 2 uploaded')).toBeTruthy())
    fireEvent.click(screen.getByRole('button', { name: 'Remove a.png' }))
    await waitFor(() => expect(screen.queryByText('a.png')).toBeNull())
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    await waitFor(() => expect(screen.getByText('No files yet')).toBeTruthy())
  })
})
