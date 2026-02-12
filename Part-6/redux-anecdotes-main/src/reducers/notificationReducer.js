import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotification() {
        return ''
    }
  }
})

const { setNotification, removeNotification } = notificationSlice.actions

export const newNotification = (notification, timer) => {
  return async (dispatch) => {
    dispatch(setNotification(notification))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timer * 1000)
  }
}

export default notificationSlice.reducer
