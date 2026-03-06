import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            login: (userFromServer) => set({user: userFromServer}),
            logout: () => set({user: null})
        }),
        {
            name: "user"
        }
    )
)