import apiClient from "./client"

export const accountService = {
  async deleteAccount(): Promise<void> {
    await apiClient.delete("/account")
  },
}
