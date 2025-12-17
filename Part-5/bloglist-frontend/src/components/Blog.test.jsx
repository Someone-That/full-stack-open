import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('<Blog />', () => {
  beforeEach(() => {
    // const blog = {
    //   'title': 'test',
    //   'author': 'auth',
    //   'url': 'http://example.com',
    //   'likes': 29,
    //   'user': {
    //     'username': 'test',
    //     'name': 'tester',
    //     'id': '693aa1e2f81076b51c30ee68'
    //   },
    //   'id': '693ab8c1c89573ed4a02e780'
    // }
    // const tuser = {
    //   name: 'test',
    //   id: '1'
    // }

    // const mockHandler = vi.fn()

    // render(<Blog blog={blog} user={tuser} addLike={mockHandler} />)
  })

  test('test addlike is called twice when clicked twice', async () => {
    const blog = {
      'title': 'test',
      'author': 'test',
      'url': 'http://example.com',
      'likes': 29,
      'user': {
        'username': 'test',
        'name': 'tester',
        'id': '693aa1e2f81076b51c30ee68'
      },
      'id': '693ab8c1c89573ed4a02e780'
    }
    const tuser = {
      name: 'test',
      id: '1'
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} user={tuser} addLike={mockHandler} />)
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('checks at start the url and likes are not displayed and checks that the blogs URL and number of likes are shown when the button controlling the shown details has been clicked and  ensures that if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const blog = {
      'title': 'test',
      'author': 'test',
      'url': 'http://example.com',
      'likes': 29,
      'user': {
        'username': 'test',
        'name': 'tester',
        'id': '693aa1e2f81076b51c30ee68'
      },
      'id': '693ab8c1c89573ed4a02e780'
    }
    const tuser = {
      name: 'test',
      id: '1'
    }

    const mockHandler = vi.fn()

    const { container } = render(<Blog blog={blog} user={tuser} addLike={mockHandler} />)
    const titleAuthor = container.querySelector('#title-author')
    expect(titleAuthor).toBeVisible()
    const urlLikes = container.querySelector('#url-likes')
    expect(urlLikes).not.toBeVisible()

    // now checks that the blog's URL and number of likes are shown when the button controlling the shown details has been clicked.
    const user = userEvent.setup()
    const button = container.querySelector('#visbilityToggler')
    await user.click(button)
    expect(urlLikes).toBeVisible()
  })
})

