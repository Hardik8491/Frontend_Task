import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"

export const useAppSelector = <T,>(selector: (state: RootState) => T): T => useSelector<RootState, T>(selector)
