import { QueryClient } from "@tanstack/react-query"
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { persistQueryClient } from "@tanstack/react-query-persist-client"

const LOCAL_KEY = "people"


export const queryClient = new QueryClient()


const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: LOCAL_KEY,
})


persistQueryClient({
  queryClient,
  persister: localStoragePersister,
})
