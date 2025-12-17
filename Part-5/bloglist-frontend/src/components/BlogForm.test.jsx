import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm addBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('write blog title here')
  const inputAuthor = screen.getByPlaceholderText('write blog author here')
  const inputURL = screen.getByPlaceholderText('write blog url here')

  const sendButton = screen.getByText('add blog')

  await user.type(inputTitle, 'testing title...')
  await user.type(inputAuthor, 'testing author...')
  await user.type(inputURL, 'testing url...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing url...')
})
