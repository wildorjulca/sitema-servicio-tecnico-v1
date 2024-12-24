import { create } from 'zustand'

interface Store {
  isModalOpen: boolean,
  openModal: () => void,
  closeModal: () => void,
}
export const useStoreMCS = create<Store>((set) => ({
  isModalOpen: false,
  openModal: () => {
    set({ isModalOpen: true })
  },
  closeModal: () => {
    set({ isModalOpen: false })
  }
}))