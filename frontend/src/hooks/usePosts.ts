import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/api/axios"

export type PollOption = { id: string; text: string; votes: number }
export type Poll = { question: string; options: PollOption[]; totalVotes: number; endsAt: string; userVote?: string }
export type Post = {
  id: string
  content: string
  author: string
  isAnonymous?: boolean
  createdAt?: string
  updatedAt?: string
  images?: string[]
  videos?: string[]
  pdfs?: { name: string; url: string }[]
  poll?: Poll
  upvotes: number
  downvotes: number
  tags: string[]
  reposts: number
  isRepost?: boolean
  repostThoughts?: string
  reported?: boolean
  trending?: boolean
  comments?: number
}
export type Comment = {
  id: string
  postId: string
  content: string
  author: string
  isAnonymous?: boolean
  createdAt?: string
}

const mapPost = (p: any): Post => ({
  ...p,
  id: p._id ?? p.id,
  createdAt: p.createdAt ?? p.timestamp,
  comments: p.comments ?? 0
})

const mapComment = (c: any): Comment => ({
  ...c,
  id: c._id ?? c.id
})

export const usePosts = (filter?: string) => {
  return useQuery<Post[], Error>(
    ["posts", filter || "recent"],
    async () => {
      const res = await api.get("/posts", { params: { filter } })
      return (res.data || []).map(mapPost)
    },
    { refetchOnWindowFocus: false }
  )
}

export const useCreatePost = () => {
  const qc = useQueryClient()
  return useMutation(
    async (formData: FormData) => {
      const res = await api.post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } })
      return mapPost(res.data)
    },
    { onSuccess: (data) => qc.invalidateQueries(["posts"]) }
  )
}

export const useVote = () => {
  const qc = useQueryClient()
  return useMutation(
    async ({ id, voteType }: { id: string; voteType: "up" | "down" }) => {
      const res = await api.post(`/posts/${id}/vote`, { voteType })
      return mapPost(res.data)
    },
    { onSuccess: () => qc.invalidateQueries(["posts"]) }
  )
}

export const usePollVote = () => {
  const qc = useQueryClient()
  return useMutation(
    async ({ id, optionId }: { id: string; optionId: string }) => {
      const res = await api.post(`/posts/${id}/poll`, { optionId })
      return mapPost(res.data)
    },
    { onSuccess: () => qc.invalidateQueries(["posts"]) }
  )
}

export const useReport = () => {
  const qc = useQueryClient()
  return useMutation(
    async (id: string) => {
      const res = await api.post(`/posts/${id}/report`)
      return res.data
    },
    { onSuccess: () => qc.invalidateQueries(["posts"]) }
  )
}

export const useComments = (postId?: string) => {
  return useQuery<Comment[], Error>(
    ["comments", postId],
    async () => {
      if (!postId) return []
      const res = await api.get(`/comments/${postId}`)
      return (res.data || []).map(mapComment)
    },
    { enabled: !!postId, refetchOnWindowFocus: false }
  )
}

export const useCreateComment = () => {
  const qc = useQueryClient()
  return useMutation(
    async (payload: { postId: string; content: string; author: string; isAnonymous: boolean }) => {
      const res = await api.post("/comments", payload)
      return mapComment(res.data)
    },
    { onSuccess: (_data, vars) => qc.invalidateQueries(["comments", vars.postId]) }
  )
}
